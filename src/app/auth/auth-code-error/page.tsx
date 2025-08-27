import Link from 'next/link'

export default function AuthCodeError() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center px-4">
      <div className="text-center space-y-6 max-w-md mx-auto">
        <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center mx-auto">
          <svg className="w-10 h-10 sm:w-12 sm:h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Authentication Error</h1>
          <p className="text-gray-600 mb-6 text-sm sm:text-base">There was an error during the authentication process. Please try signing in again.</p>
          <Link
            href="/login"
            className="inline-flex items-center justify-center px-6 sm:px-8 py-3 rounded-xl font-medium bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl text-sm sm:text-base"
          >
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  )
}
