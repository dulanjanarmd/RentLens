import React from 'react'
import { HelpCircle, FileText, Settings, ShieldAlert } from 'lucide-react'
import { useAppNavigation } from '@/hooks/useAppNavigation'

export default function HelpCenter() {
  const onNavigate = useAppNavigation()

  return (
    <div className="min-h-screen bg-background pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-foreground mb-4 tracking-tight">Help Center</h1>
          <p className="text-lg text-muted-foreground">
            How can we help you today? Find answers to your questions below.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <div className="bg-card p-6 rounded-3xl border border-border text-center shadow-sm hover:shadow-md transition-shadow cursor-pointer">
            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mx-auto mb-4">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-foreground mb-2">Getting Started</h3>
            <p className="text-sm text-muted-foreground">Learn how to create an account and list properties.</p>
          </div>
          <div className="bg-card p-6 rounded-3xl border border-border text-center shadow-sm hover:shadow-md transition-shadow cursor-pointer">
            <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-500 mx-auto mb-4">
              <Settings className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-foreground mb-2">Account Settings</h3>
            <p className="text-sm text-muted-foreground">Manage your profile, password, and preferences.</p>
          </div>
          <div className="bg-card p-6 rounded-3xl border border-border text-center shadow-sm hover:shadow-md transition-shadow cursor-pointer">
            <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500 mx-auto mb-4">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-foreground mb-2">Trust & Safety</h3>
            <p className="text-sm text-muted-foreground">Learn about our verification processes and reporting.</p>
          </div>
          <div className="bg-card p-6 rounded-3xl border border-border text-center shadow-sm hover:shadow-md transition-shadow cursor-pointer" onClick={() => onNavigate('contact')}>
            <div className="w-12 h-12 bg-orange-500/10 rounded-2xl flex items-center justify-center text-orange-500 mx-auto mb-4">
              <HelpCircle className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-foreground mb-2">Contact Support</h3>
            <p className="text-sm text-muted-foreground">Still need help? Reach out to our team directly.</p>
          </div>
        </div>

        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-foreground mb-8">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <div className="bg-card p-6 rounded-2xl border border-border">
              <h4 className="font-bold text-foreground mb-2">What is the Rent Value Score (RVS)?</h4>
              <p className="text-muted-foreground">The RVS is our proprietary algorithm that evaluates a property's price against its features, location, and market average to tell you if it's a good deal.</p>
            </div>
            <div className="bg-card p-6 rounded-2xl border border-border">
              <h4 className="font-bold text-foreground mb-2">How do I contact a landlord?</h4>
              <p className="text-muted-foreground">You can find the landlord's contact information directly on the property details page. Just click on any listing you're interested in.</p>
            </div>
            <div className="bg-card p-6 rounded-2xl border border-border">
              <h4 className="font-bold text-foreground mb-2">Is RentLens free to use?</h4>
              <p className="text-muted-foreground">Yes! RentLens is completely free for tenants searching for homes. Landlords can also list their properties for free during our beta period.</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
