'use client'

import { motion } from 'framer-motion'

export default function CTASection() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.4 }}
      className="text-center mt-20 py-16"
    >
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
          Ready to Create Amazing AI Art?
        </h2>
        <p className="text-xl text-gray-600 mb-8">
          Join thousands of creators who are already using Image Prompt to enhance their AI art workflow.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200 shadow-lg"
          >
            Get Started for Free
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="border-2 border-purple-600 text-purple-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-purple-50 transition-colors"
          >
            View Examples
          </motion.button>
        </div>

        <div className="text-center">
          <p className="text-gray-500 mb-4">You may be interested in:</p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="#" className="text-purple-600 hover:text-purple-800 underline">
              What is an Image Prompt?
            </a>
            <a href="#" className="text-purple-600 hover:text-purple-800 underline">
              How to Write Effective Image Prompt?
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  )
}