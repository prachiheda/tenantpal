"use client"

import { useState } from "react"
import { Shield, Scale, FileText, MessageSquare, Clock, Sparkles, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import LeaseIssueForm from "@/components/lease-issue-form"
import LoadingSpinner from "@/components/loading-spinner"
import Navbar from "@/components/navbar"
import FeatureCard from "@/components/feature-card"
import TestimonialCard from "@/components/testimonial-card"
import { Card, CardContent } from "@/components/ui/card"

// Define the expected structure of the final report (update if Python output changes)
interface RenterSupportReport { // Uncommented interface
    renter_support_report: {
        issue_summary: string;
        legal_analysis: {
            identified_rights: string;
            lease_flags: string;
        };
        communication_draft: string;
        urgency_assessment: {
            level: string;
            justification: string;
        };
        recommended_next_steps: string[];
    };
}

export default function Home() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<RenterSupportReport | null>(null) // Changed state type back
  const [error, setError] = useState<string | null>(null)

  // Type for the form data passed from LeaseIssueForm
  interface FormData {
    issue: string;
    leaseClause: string;
  }

  // Handle form submission - receives data from LeaseIssueForm
  const handleSubmit = async (data: FormData) => {
    setIsLoading(true)
    setResult(null) // Clear previous result
    setError(null) // Clear previous error

    try {
      const response: Response = await fetch('/api/run-crew', { // Explicitly type Response
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // Send the data received from the form component
        body: JSON.stringify({
          renter_issue_description: data.issue, 
          lease_document: data.leaseClause, 
        }),
      })

      const responseData = await response.json() // API route now returns parsed JSON

      if (!response.ok) {
        console.error("API Error Response:", responseData);
        // Attempt to get more specific error from backend if available
        const errorDetail = responseData.details || responseData.error || 'Failed to run analysis.';
        throw new Error(errorDetail);
      }
      
      // Directly set the parsed JSON result from the API
      setResult(responseData as RenterSupportReport); 
           
      setError(null); // Clear previous errors
    } catch (err: unknown) {
      console.error("Error submitting form:", err)
      setError(err instanceof Error ? err.message : "An unknown error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const features = [
    {
      icon: Shield,
      title: "Lease Analysis",
      description: "Our AI analyzes your lease to identify problematic clauses and potential legal issues.",
    },
    {
      icon: Scale,
      title: "Legal Insights",
      description: "Get plain-language explanations of your rights and options based on real legal precedents.",
    },
    {
      icon: FileText,
      title: "Document Generation",
      description: "Create customized legal letters and responses to address issues with your landlord.",
    },
    {
      icon: MessageSquare,
      title: "Expert Support",
      description: "Connect with tenant rights attorneys for personalized advice when you need it most.",
    },
    {
      icon: Clock,
      title: "24/7 Availability",
      description: "Access help whenever you need it, without waiting for business hours or appointments.",
    },
    {
      icon: Sparkles,
      title: "AI-Powered",
      description: "Our advanced AI has been trained on thousands of lease agreements and legal cases.",
    },
  ]

  const testimonials = [
    {
      quote:
        "TenantPal helped me understand my rights when my landlord tried to charge an illegal fee. I saved over $500!",
      author: "Sarah Johnson",
      role: "Tenant in Chicago",
      imageUrl: "/placeholder.svg?height=100&width=100",
    },
    {
      quote:
        "I was about to sign a lease with several red flags. TenantPal identified the issues and helped me negotiate better terms.",
      author: "Michael Chen",
      role: "Student Renter",
      imageUrl: "/placeholder.svg?height=100&width=100",
    },
    {
      quote:
        "When my heat wasn't working for weeks, TenantPal guided me through the exact steps to take. Problem solved within days!",
      author: "Jessica Rodriguez",
      role: "Apartment Renter",
      imageUrl: "/placeholder.svg?height=100&width=100",
    },
  ]

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-emerald-50 to-white py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:gap-12 items-center">
            <div className="flex flex-col justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                  Your Free AI Legal Assistant for Tenant Rights
                </h1>
                <p className="max-w-[600px] text-gray-500 md:text-xl mx-auto">
                  TenantPal helps you understand your lease, know your rights, and resolve disputes with your
                  landlord—completely free, with no hidden costs.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row justify-center">
                <Button className="bg-emerald-500 hover:bg-emerald-600 h-11 px-8">Get Started Free</Button>
                <Button variant="outline" className="h-11 px-8">
                  How It Works
                </Button>
              </div>
              <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
                <div className="flex items-center">
                  <CheckCircle className="mr-1 h-4 w-4 text-emerald-500" />
                  <span>100% Free</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="mr-1 h-4 w-4 text-emerald-500" />
                  <span>No credit card required</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Form and Results Section - ADDED */}
      <section id="analyzer" className="py-16 md:py-24">
        <div className="container px-4 md:px-6"> 
           <div className="w-full rounded-xl border bg-background p-6 shadow-lg">
              <div className="mb-4">
                <h2 className="text-2xl font-bold text-center">Try Our Free Lease Analyzer</h2>
                <p className="text-sm text-muted-foreground text-center">Get an instant analysis of your issue and lease clause</p>
              </div>
              <LeaseIssueForm onSubmit={handleSubmit} isLoading={isLoading} />

              {isLoading && (
                <div className="flex flex-col items-center justify-center py-10">
                  <LoadingSpinner size="lg" />
                  <p className="mt-4 text-muted-foreground">Analyzing your lease issue...</p>
                </div>
              )}

              {error && !isLoading && (
                <div className="mt-6 space-y-2 text-red-600 border border-red-300 bg-red-50 p-4 rounded-md">
                  <h3 className="text-lg font-semibold">Error</h3>
                  <p className="text-sm">{error}</p>
                </div>
              )}

              {result && (
                <Card className="w-full mt-6">
                  <CardContent>
                    {/* Re-enabled simple display of parsed JSON */}
                    <div className="space-y-4 text-sm">
                       <div>
                        <h4 className="font-semibold text-lg">Issue Summary:</h4>
                        <p>{result.renter_support_report.issue_summary}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-lg">Legal Analysis:</h4>
                        <p><strong>Rights:</strong> {result.renter_support_report.legal_analysis.identified_rights}</p>
                        <p><strong>Lease Flags:</strong> {result.renter_support_report.legal_analysis.lease_flags}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-lg">Communication Draft:</h4>
                        <pre className="whitespace-pre-wrap break-words text-sm bg-gray-100 p-2 rounded-md">{result.renter_support_report.communication_draft}</pre>
                      </div>
                      <div>
                        <h4 className="font-semibold text-lg">Urgency Assessment:</h4>
                        <p>
                          <strong>Level:</strong>{' '}
                          {
                            (() => {
                              const level = result.renter_support_report.urgency_assessment.level.toLowerCase();
                              if (level.includes('urgent')) return '🚨';
                              if (level.includes('concerning')) return '⚠️';
                              if (level.includes('routine')) return '✅';
                              return ''; // Default: no emoji
                            })()
                          }
                          {' '}{result.renter_support_report.urgency_assessment.level}
                        </p>
                        <p><strong>Justification:</strong> {result.renter_support_report.urgency_assessment.justification}</p>
                      </div>
                       <div>
                        <h4 className="font-semibold text-lg">Recommended Next Steps:</h4>
                        <ul className="list-disc pl-5">
                          {result.renter_support_report.recommended_next_steps.map((step, index) => (
                            <li key={index}>{step}</li>
                          ))}
                        </ul>
                      </div> 
                    </div>
                    {/* Replace above div with <JsonDisplay data={result} /> if you prefer that component */}
                  </CardContent>
                </Card>
              )}
            </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                Features
              </div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">How TenantPal Helps You</h2>
              <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Our AI-powered platform provides the tools and knowledge you need to navigate rental challenges with
                confidence - all completely free.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 pt-12">
            {features.map((feature, index) => (
              <FeatureCard key={index} icon={feature.icon} title={feature.title} description={feature.description} />
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="bg-gray-50 py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                Process
              </div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">How It Works</h2>
              <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Get answers to your rental questions in three simple steps - no cost, no catch.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-3 pt-12">
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-900">
                <span className="text-2xl font-bold">1</span>
              </div>
              <h3 className="mb-2 text-xl font-semibold">Share Your Issue</h3>
              <p className="text-muted-foreground">
                Describe your rental problem and paste the relevant lease clause for analysis.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-900">
                <span className="text-2xl font-bold">2</span>
              </div>
              <h3 className="mb-2 text-xl font-semibold">Get AI Analysis</h3>
              <p className="text-muted-foreground">
                Our AI reviews your situation, identifies legal issues, and researches relevant cases.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-900">
                <span className="text-2xl font-bold">3</span>
              </div>
              <h3 className="mb-2 text-xl font-semibold">Take Informed Action</h3>
              <p className="text-muted-foreground">
                Receive clear recommendations and tools to resolve your issue effectively.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                Testimonials
              </div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">What Our Users Say</h2>
              <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Join thousands of tenants who have successfully resolved their rental issues with TenantPal.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3 pt-12">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard
                key={index}
                quote={testimonial.quote}
                author={testimonial.author}
                role={testimonial.role}
                imageUrl={testimonial.imageUrl}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-50 py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Ready to Stand Up For Your Rights?
              </h2>
              <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Join thousands of tenants who have successfully resolved their rental issues with TenantPal - completely
                free.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Button className="bg-emerald-500 hover:bg-emerald-600 h-11 px-8">Get Started Free</Button>
              <Button variant="outline" className="h-11 px-8">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
