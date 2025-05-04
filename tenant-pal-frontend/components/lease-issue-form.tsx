"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

interface LeaseIssueFormProps {
  onSubmit: (data: { issue: string; leaseClause: string }) => void
  isLoading?: boolean
}

export default function LeaseIssueForm({ onSubmit, isLoading = false }: LeaseIssueFormProps) {
  const [issue, setIssue] = useState("")
  const [leaseClause, setLeaseClause] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({ issue, leaseClause })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <label htmlFor="issue" className="block text-sm font-medium">
          Describe your issue
        </label>
        <Textarea
          id="issue"
          value={issue}
          onChange={(e) => setIssue(e.target.value)}
          placeholder="Please describe your issue in detail..."
          className="min-h-[150px] w-full"
          required
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="leaseClause" className="block text-sm font-medium">
          Paste your relevant lease clause(s)
        </label>
        <Textarea
          id="leaseClause"
          value={leaseClause}
          onChange={(e) => setLeaseClause(e.target.value)}
          placeholder="Copy and paste the relevant sections from your lease agreement..."
          className="min-h-[100px] w-full"
          required
        />
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Submitting..." : "Get Free Analysis"}
      </Button>
    </form>
  )
}
