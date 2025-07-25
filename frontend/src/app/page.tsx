import Link from "next/link";
import { Brain, Target, TrendingUp, FileText } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          {/* Logo/Brand */}
          <div className="flex items-center justify-center mb-8">
            <Brain className="w-12 h-12 text-indigo-600 mr-3" />
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white">
              Skillara
            </h1>
          </div>

          {/* Tagline */}
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8">
            Anonymous Skill Gap Analyzer
          </p>

          {/* Description */}
          <p className="text-lg text-gray-700 dark:text-gray-400 mb-12 max-w-2xl mx-auto">
            Upload your resume and discover your skill gaps. Get personalized recommendations
            to bridge the gap between your current skills and your dream job. 100% anonymous,
            instant analysis.
          </p>

          {/* CTA Button */}
          <Link
            href="/upload"
            className="inline-flex items-center px-8 py-4 text-lg font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
          >
            <FileText className="w-6 h-6 mr-2" />
            Analyze My Skills
          </Link>
        </div>

        {/* Features Section */}
        <div className="mt-24 grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
            <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <Brain className="w-8 h-8 text-indigo-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              AI-Powered Analysis
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Advanced AI extracts skills from your resume with high accuracy using multiple providers
            </p>
          </div>

          <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <Target className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Gap Analysis
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Compare your skills against target job roles and identify exactly what you need to learn
            </p>
          </div>

          <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
            <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Market Intelligence
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Get insights on skill demand, salary impact, and career progression opportunities
            </p>
          </div>
        </div>

        {/* Key Benefits */}
        <div className="mt-16 text-center">
          <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-600 dark:text-gray-400">
            <span className="bg-white dark:bg-gray-800 px-4 py-2 rounded-full shadow">
              ✅ 100% Anonymous
            </span>
            <span className="bg-white dark:bg-gray-800 px-4 py-2 rounded-full shadow">
              ⚡ Instant Results
            </span>
            <span className="bg-white dark:bg-gray-800 px-4 py-2 rounded-full shadow">
              🆓 Completely Free
            </span>
            <span className="bg-white dark:bg-gray-800 px-4 py-2 rounded-full shadow">
              📄 PDF & DOCX Support
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
