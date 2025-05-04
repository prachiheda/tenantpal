"use client"

import { useState } from "react"
import { ChevronDown, ChevronRight } from "lucide-react"

interface JsonDisplayProps {
  data: unknown
  className?: string
}

export default function JsonDisplay({ data, className = "" }: JsonDisplayProps) {
  if (!data) return null

  return (
    <div className={`rounded-lg border bg-card p-4 text-card-foreground shadow-sm ${className}`}>
      <pre className="font-mono text-sm">
        <JsonNode data={data} level={0} />
      </pre>
    </div>
  )
}

interface JsonNodeProps {
  data: unknown
  level: number
  path?: string
}

function JsonNode({ data, level, path = "" }: JsonNodeProps) {
  const [isCollapsed, setIsCollapsed] = useState(level > 1)

  if (data === null) return <span className="text-gray-500">null</span>

  if (typeof data === "undefined") return <span className="text-gray-500">undefined</span>

  if (typeof data === "string") return <span className="text-green-600">{`"${data}"`}</span>

  if (typeof data === "number") return <span className="text-blue-600">{data}</span>

  if (typeof data === "boolean") return <span className="text-purple-600">{data.toString()}</span>

  if (Array.isArray(data)) {
    if (data.length === 0) return <span>[]</span>

    return (
      <div>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="inline-flex items-center focus:outline-none hover:text-blue-500"
        >
          {isCollapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
          <span className="text-gray-700">Array({data.length})</span>
        </button>

        {!isCollapsed && (
          <div>
            <span>[</span>
            <div className="ml-4">
              {data.map((item, index) => (
                <div key={`${path}-${index}`}>
                  <JsonNode data={item} level={level + 1} path={`${path}[${index}]`} />
                  {index < data.length - 1 && <span>,</span>}
                </div>
              ))}
            </div>
            <span>]</span>
          </div>
        )}
      </div>
    )
  }

  if (typeof data === "object" && data !== null) {
    const objData = data as Record<string, unknown>
    const keys = Object.keys(objData)
    if (keys.length === 0) return <>{'{'}{'}'}</>

    return (
      <div>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="inline-flex items-center focus:outline-none hover:text-blue-500"
        >
          {isCollapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
          <span className="text-gray-700">Object({keys.length})</span>
        </button>

        {!isCollapsed && (
          <div>
            <span>{'{'}</span>
            <div className="ml-4">
              {keys.map((key, index) => (
                <div key={`${path}-${key}`}>
                  <span className="text-red-600">{`"${key}"`}</span>:{" "}
                  <JsonNode data={objData[key]} level={level + 1} path={`${path}.${key}`} />
                  {index < keys.length - 1 && <span>,</span>}
                </div>
              ))}
            </div>
            <span>{'}'}</span>
          </div>
        )}
      </div>
    )
  }

  return <span>{String(data)}</span>
}
