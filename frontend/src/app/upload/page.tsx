import { FileUpload } from "@/components/upload/FileUpload";
import { Brain, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function UploadPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/"
            className="flex items-center text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Home
          </Link>

          <div className="flex items-center">
            <Brain className="w-8 h-8 text-indigo-600 mr-2" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Skillara
            </h1>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Upload Your Resume
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Upload your resume in PDF or DOCX format and let our AI analyze your skills.
              We&apos;ll identify your strengths and suggest areas for improvement.
            </p>
          </div>

          {/* Upload Component */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
            <FileUpload />
          </div>

          {/* Privacy Notice */}
          <div className="mt-8 text-center">
            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 max-w-2xl mx-auto">
              <p className="text-sm text-green-700 dark:text-green-300">
                🔒 <strong>Privacy First:</strong> Your resume is processed anonymously and temporarily.
                We don&apos;t store your personal information or documents permanently.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
