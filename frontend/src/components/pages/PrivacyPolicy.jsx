import React from 'react'

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-background pt-24 pb-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-extrabold text-foreground mb-8">Privacy Policy</h1>
        <div className="prose prose-lg dark:prose-invert">
          <p>Last updated: {new Date().toLocaleDateString()}</p>
          
          <h2>1. Information We Collect</h2>
          <p>
            At RentLens, we collect information to provide better services to all our users. We collect information in the following ways:
            <ul>
              <li><strong>Information you give us:</strong> For example, our services require you to sign up for a RentLens Account. When you do, we'll ask for personal information, like your name, email address, and telephone number.</li>
              <li><strong>Information we get from your use of our services:</strong> We collect information about the services that you use and how you use them.</li>
            </ul>
          </p>

          <h2>2. How We Use Information We Collect</h2>
          <p>
            We use the information we collect from all of our services to provide, maintain, protect and improve them, to develop new ones, and to protect RentLens and our users.
          </p>

          <h2>3. Transparency and Choice</h2>
          <p>
            People have different privacy concerns. Our goal is to be clear about what information we collect, so that you can make meaningful choices about how it is used.
          </p>

          <h2>4. Information Security</h2>
          <p>
            We work hard to protect RentLens and our users from unauthorized access to or unauthorized alteration, disclosure or destruction of information we hold.
          </p>
        </div>
      </div>
    </div>
  )
}
