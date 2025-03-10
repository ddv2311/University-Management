import mongoose from 'mongoose';

export async function queryStudents(naturalQuery) {
  try {
    const Student = mongoose.model('Student');
    const User = mongoose.model('User');
    const searchText = naturalQuery?.trim().toLowerCase() || '';

    console.log('Processing query:', searchText);
    console.log('Database:', mongoose.connection.db.databaseName);
    console.log('Connection State:', mongoose.connection.readyState);

    // For "show all" queries, use a direct find approach
    if (searchText.match(/show all|list all|find all|get all/i)) {
      console.log('Query type: Show all students');

      // First, get all students directly
      const allStudents = await Student.find()
        .populate('userId', 'name email role')
        .populate('courses', 'name code')
        .lean();

      console.log(`Found ${allStudents.length} students in total`);

      // Log the first few students for debugging
      if (allStudents.length > 0) {
        console.log('First student sample:', JSON.stringify(allStudents[0], null, 2));
      }

      // Format the results
      const formattedResults = allStudents.map(student => {
        // Log each student being processed
        console.log(`Processing student: ${student.enrollmentNumber}`);
        
        return {
          enrollmentNumber: student.enrollmentNumber || '-',
          department: student.department || '-',
          semester: student.semester || '-',
          name: student.userId?.name || 'Unknown',
          email: student.userId?.email || 'Unknown',
          cgpa: student.cgpa?.toFixed(2) || '-',
          courses: Array.isArray(student.courses) ? 
            student.courses
              .filter(c => c && (c.name || c.code)) // Filter out null/empty courses
              .map(c => `${c.name || ''} (${c.code || ''})`)
              .filter(c => c !== ' ()')
              .join(', ') || 'No courses' : 'No courses'
        };
      });

      return {
        success: true,
        data: formattedResults,
        total: formattedResults.length,
        message: `Found ${formattedResults.length} student(s)`
      };
    }

    // For specific queries, use the aggregation pipeline
    const pipeline = [
      // Join with users collection
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'userDetails'
        }
      },
      // Join with courses collection
      {
        $lookup: {
          from: 'courses',
          localField: 'courses',
          foreignField: '_id',
          as: 'courseDetails'
        }
      },
      // Ensure we still get students even if userDetails might be empty
      {
        $unwind: {
          path: '$userDetails',
          preserveNullAndEmptyArrays: true
        }
      }
    ];

    // Add search conditions based on natural language query
    if (searchText.match(/department|dept/i)) {
      const deptPatterns = [
        { pattern: /\b(computer|cse|cs|it|information technology)\b/i, value: 'Computer Science' },
        { pattern: /\b(math|mathematics|maths)\b/i, value: 'Mathematics' },
        { pattern: /\b(physics|phy)\b/i, value: 'Physics' },
        { pattern: /\b(chemistry|chem)\b/i, value: 'Chemistry' },
        { pattern: /\b(biology|bio)\b/i, value: 'Biology' },
        { pattern: /\b(electrical|eee|electrical engineering)\b/i, value: 'Electrical Engineering' },
        { pattern: /\b(mechanical|mech|mechanical engineering)\b/i, value: 'Mechanical Engineering' },
        { pattern: /\b(civil|civil engineering)\b/i, value: 'Civil Engineering' }
      ];

      for (const dept of deptPatterns) {
        if (searchText.match(dept.pattern)) {
          console.log(`Query type: Department filter - ${dept.value}`);
          pipeline.push({
            $match: { department: dept.value }
          });
          break;
        }
      }
    } 
    else if (searchText.match(/semester|sem/i)) {
      const semMatch = searchText.match(/\b([1-8])(st|nd|rd|th)?\b/);
      if (semMatch) {
        const semester = parseInt(semMatch[1]);
        console.log(`Query type: Semester filter - ${semester}`);
        pipeline.push({
          $match: { semester: semester }
        });
      }
    }
    else if (searchText.match(/cgpa|gpa|grade/i)) {
      const cgpaMatch = searchText.match(/\b(above|greater than|more than|higher than|>)\s*([0-9](\.[0-9]+)?)\b/i);
      if (cgpaMatch) {
        const cgpaValue = parseFloat(cgpaMatch[2]);
        console.log(`Query type: CGPA filter - above ${cgpaValue}`);
        pipeline.push({
          $match: { cgpa: { $gte: cgpaValue } }
        });
      } else {
        const cgpaLessMatch = searchText.match(/\b(below|less than|lower than|<)\s*([0-9](\.[0-9]+)?)\b/i);
        if (cgpaLessMatch) {
          const cgpaValue = parseFloat(cgpaLessMatch[2]);
          console.log(`Query type: CGPA filter - below ${cgpaValue}`);
          pipeline.push({
            $match: { cgpa: { $lte: cgpaValue } }
          });
        }
      }
    }
    else if (searchText.match(/course|subject|class/i)) {
      const courseMatch = searchText.match(/\b(taking|enrolled in|studying|in)\s+([a-z0-9\s]+)\b/i);
      if (courseMatch) {
        const courseName = courseMatch[2].trim();
        console.log(`Query type: Course filter - ${courseName}`);
        pipeline.push({
          $match: { 'courseDetails.name': { $regex: courseName, $options: 'i' } }
        });
      }
    }
    else if (searchText.match(/name|called|named/i)) {
      const nameMatch = searchText.match(/\b(name|called|named)\s+([a-z\s]+)\b/i);
      if (nameMatch) {
        const studentName = nameMatch[2].trim();
        console.log(`Query type: Name filter - ${studentName}`);
        pipeline.push({
          $match: { 'userDetails.name': { $regex: studentName, $options: 'i' } }
        });
      }
    }
    else {
      console.log('Query type: General search');
      pipeline.push({
        $match: {
          $or: [
            { enrollmentNumber: { $regex: searchText, $options: 'i' } },
            { department: { $regex: searchText, $options: 'i' } },
            { 'userDetails.name': { $regex: searchText, $options: 'i' } },
            { 'userDetails.email': { $regex: searchText, $options: 'i' } },
            { 'courseDetails.name': { $regex: searchText, $options: 'i' } },
            { 'courseDetails.code': { $regex: searchText, $options: 'i' } }
          ]
        }
      });
    }

    // Final projection
    pipeline.push({
      $project: {
        _id: 0,
        enrollmentNumber: 1,
        department: 1,
        semester: 1,
        cgpa: 1,
        name: { $ifNull: ['$userDetails.name', 'Unknown'] },
        email: { $ifNull: ['$userDetails.email', 'Unknown'] },
        courses: {
          $cond: {
            if: { $isArray: '$courseDetails' },
            then: {
              $reduce: {
                input: '$courseDetails',
                initialValue: '',
                in: {
                  $concat: [
                    '$$value',
                    { $cond: [{ $eq: ['$$value', ''] }, '', ', '] },
                    { $ifNull: ['$$this.name', ''] },
                    ' (',
                    { $ifNull: ['$$this.code', ''] },
                    ')'
                  ]
                }
              }
            },
            else: 'No courses'
          }
        }
      }
    });

    // Execute pipeline with logging
    console.log('Executing pipeline:', JSON.stringify(pipeline, null, 2));
    const results = await Student.aggregate(pipeline);
    console.log(`Aggregation returned ${results.length} results`);

    // Format results
    const formattedResults = results.map(student => ({
      enrollmentNumber: student.enrollmentNumber || '-',
      department: student.department || '-',
      semester: student.semester || '-',
      name: student.name || '-',
      email: student.email || '-',
      courses: student.courses || '-',
      cgpa: student.cgpa?.toFixed(2) || '-'
    }));

    return {
      success: true,
      data: formattedResults,
      total: formattedResults.length,
      message: `Found ${formattedResults.length} student(s)`
    };

  } catch (error) {
    console.error('Query failed:', error);
    console.error('Full error stack:', error.stack);
    return {
      success: false,
      data: [],
      total: 0,
      error: error.message,
      message: 'Failed to execute query'
    };
  }
}