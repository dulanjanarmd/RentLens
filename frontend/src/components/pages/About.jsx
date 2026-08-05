import React from 'react'
import { Aperture, Target, Users, Zap, Shield, TrendingUp } from 'lucide-react'

export default function About() {
  return (
    <div className="min-h-screen bg-background pt-24 pb-12">
      {/* Hero Section */}
      <div className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-slate-900/5 z-0" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl mb-6">
            <Aperture className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-foreground tracking-tight mb-6">
            Rethinking Real Estate in Sri Lanka
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            RentLens was founded on a simple premise: renting a home should be transparent, fair, and backed by hard data. We're here to change the game.
          </p>
        </div>
      </div>

      {/* Mission Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-6">Our Mission</h2>
            <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
              For decades, the Sri Lankan rental market has been plagued by information asymmetry. Tenants often overpay for properties with hidden issues, while good landlords struggle to stand out.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              We built RentLens to democratize real estate data. By introducing the <strong>Rent Value Score (RVS)</strong> and combining it with verified community reviews, we empower everyone to make smarter, data-driven decisions.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-card p-6 rounded-3xl border border-border shadow-sm">
              <Target className="w-8 h-8 text-primary mb-4" />
              <h3 className="font-bold text-foreground mb-2">Transparency</h3>
              <p className="text-sm text-muted-foreground">No hidden fees, no fake listings. Just honest data.</p>
            </div>
            <div className="bg-card p-6 rounded-3xl border border-border shadow-sm mt-8">
              <Users className="w-8 h-8 text-blue-500 mb-4" />
              <h3 className="font-bold text-foreground mb-2">Community</h3>
              <p className="text-sm text-muted-foreground">Real reviews from people who have lived there.</p>
            </div>
            <div className="bg-card p-6 rounded-3xl border border-border shadow-sm">
              <Shield className="w-8 h-8 text-emerald-500 mb-4" />
              <h3 className="font-bold text-foreground mb-2">Trust</h3>
              <p className="text-sm text-muted-foreground">Verified landlords and secure communication.</p>
            </div>
            <div className="bg-card p-6 rounded-3xl border border-border shadow-sm mt-8">
              <TrendingUp className="w-8 h-8 text-orange-500 mb-4" />
              <h3 className="font-bold text-foreground mb-2">Analytics</h3>
              <p className="text-sm text-muted-foreground">Market trends and RVS algorithms to guide you.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
