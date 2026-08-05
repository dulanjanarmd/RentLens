import React from 'react'

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-background pt-24 pb-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-extrabold text-foreground mb-8">Terms of Service</h1>
        <div className="prose prose-lg dark:prose-invert">
          <p>Last updated: {new Date().toLocaleDateString()}</p>
          
          <h2>1. Terms</h2>
          <p>
            By accessing the website at RentLens, you are agreeing to be bound by these terms of service, all applicable laws and regulations, and agree that you are responsible for compliance with any applicable local laws.
          </p>

          <h2>2. Use License</h2>
          <p>
            Permission is granted to temporarily download one copy of the materials (information or software) on RentLens' website for personal, non-commercial transitory viewing only.
          </p>

          <h2>3. Disclaimer</h2>
          <p>
            The materials on RentLens' website are provided on an 'as is' basis. RentLens makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
          </p>

          <h2>4. Limitations</h2>
          <p>
            In no event shall RentLens or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on RentLens' website.
          </p>
        </div>
      </div>
    </div>
  )
}
