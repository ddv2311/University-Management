import React, { useState, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';

// Define default columns to ensure we always have a valid structure
const DEFAULT_COLUMNS = [
  { field: 'enrollmentNumber', headerName: 'Enrollment No' },
  { field: 'department', headerName: 'Department' },
  { field: 'semester', headerName: 'Semester' },
  { field: 'name', headerName: 'Name' },
  { field: 'email', headerName: 'Email' },
  { field: 'cgpa', headerName: 'CGPA' },
  { field: 'courses', headerName: 'Courses' }
];

interface ServerResponse {
  success: boolean;
  columns?: Array<{ field: string; headerName: string }>;
  rows?: any[];
  message?: string;
  error?: string;
}

interface QueryResult {
  success: boolean;
  columns: Array<{ field: string; headerName: string }>;
  rows: any[];
  message: string;
}

const TextToSQL: React.FC = () => {
  const [naturalQuery, setNaturalQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<QueryResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const executeQuery = useCallback(async () => {
    if (!naturalQuery.trim()) {
      setError('Please enter a query');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setResult(null);

      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch('http://localhost:5000/api/nl-query/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          query: naturalQuery,
          debug: true
        })
      });

      const data: ServerResponse = await response.json();
      console.log('Server response:', data);

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to execute query');
      }

      // Transform and validate the response
      const formattedResult: QueryResult = {
        success: true,
        columns: data.columns || DEFAULT_COLUMNS,
        rows: Array.isArray(data.rows) ? data.rows.map(row => ({
          ...row,
          courses: Array.isArray(row.courses) 
            ? row.courses.map((c: any) => c.name || c).join(', ')
            : row.courses
        })) : [],
        message: data.message || `Found ${data.rows?.length || 0} result(s)`
      };

      setResult(formattedResult);
      setError(null);

    } catch (err) {
      console.error('Query execution error:', err);
      setError(err instanceof Error ? err.message : 'Failed to execute query');
      setResult(null);
    } finally {
      setLoading(false);
    }
  }, [naturalQuery]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      e.preventDefault();
      executeQuery();
    }
  };

  // Example queries that match our enhanced backend capabilities
  const exampleQueries = [
    "Show all students",
    "Find students in Computer Science department",
    "List students in semester 4",
    "Students with CGPA above 8",
    "Find students taking Database Management",
    "Students named John",
    "Show students in Mechanical Engineering",
    "Find students with CGPA below 6"
  ];

  // Function to set an example query
  const setExampleQuery = (query: string) => {
    setNaturalQuery(query);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Natural Language Query Interface</h1>
      
      <div className="bg-white shadow-lg rounded-lg p-6">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Enter your query in natural language
          </label>
          <textarea
            value={naturalQuery}
            onChange={(e) => setNaturalQuery(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Example: Show all students in CSE department"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            rows={4}
            disabled={loading}
          />
          <div className="mt-2 space-y-1 text-sm text-gray-500">
            <p>Example queries:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
              {exampleQueries.map((query, index) => (
                <button
                  key={index}
                  onClick={() => setExampleQuery(query)}
                  className="text-left px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded text-sm text-gray-700 truncate"
                >
                  {query}
                </button>
              ))}
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        <button
          onClick={executeQuery}
          disabled={!naturalQuery.trim() || loading}
          className="w-full md:w-auto px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </span>
          ) : (
            'Execute Query'
          )}
        </button>
      </div>

      {result && (
        <div className="mt-6 bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="p-4 bg-blue-50 border-b border-blue-100">
            <p className="text-blue-700">{result.message}</p>
          </div>
          <div className="overflow-x-auto">
            {result.rows.length > 0 ? (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {result.columns.map((column, i) => (
                      <th
                        key={i}
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        {column.headerName}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {result.rows.map((row, rowIndex) => (
                    <tr key={rowIndex} className={rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      {result.columns.map((column, colIndex) => (
                        <td
                          key={colIndex}
                          className="px-6 py-4 whitespace-normal text-sm text-gray-900"
                        >
                          {row[column.field]?.toString() || '-'}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-4 text-gray-500">No results found</div>
            )}
          </div>
        </div>
      )}

      {/* Debug information in development */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-4 p-4 bg-gray-100 rounded-lg">
          <details>
            <summary className="text-sm font-medium text-gray-700 cursor-pointer">
              Debug Information
            </summary>
            <div className="mt-2">
              <p className="text-xs text-gray-500">Query: {naturalQuery}</p>
              {result && (
                <pre className="mt-2 p-2 bg-white rounded text-xs overflow-auto">
                  {JSON.stringify(result, null, 2)}
                </pre>
              )}
            </div>
          </details>
        </div>
      )}
    </div>
  );
};

export default TextToSQL;