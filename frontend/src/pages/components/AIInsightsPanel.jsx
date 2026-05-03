import { useAI } from "../../context/AIContext";
import {
  Brain,
  Lightbulb,
  AlertTriangle,
  RefreshCw,
  Loader2,
  ChevronDown,
  ChevronUp,
  Sparkles
} from "lucide-react";
import { useState } from "react";

const InsightCard = ({ title, items, icon: Icon, colorClass, borderColor, emptyText }) => {
  const [expanded, setExpanded] = useState(true);

  return (
    <div className={`bg-white rounded-xl shadow-sm border-l-4 ${borderColor} p-4`}>
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center justify-between w-full mb-2"
      >
        <div className="flex items-center gap-2">
          <Icon size={18} className={colorClass} />
          <h3 className="font-semibold text-gray-800">{title}</h3>
          {items.length > 0 && (
            <span className={`text-xs px-2 py-0.5 rounded-full ${colorClass} bg-opacity-10`}>
              {items.length}
            </span>
          )}
        </div>
        {expanded ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
      </button>

      {expanded && (
        <div className="space-y-2">
          {items.length === 0 ? (
            <p className="text-sm text-gray-400 italic">{emptyText}</p>
          ) : (
            items.map((item, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg text-sm ${
                  item.severity === "critical"
                    ? "bg-red-50 text-red-800 border border-red-100"
                    : item.severity === "warning"
                    ? "bg-yellow-50 text-yellow-800 border border-yellow-100"
                    : item.severity === "success"
                    ? "bg-green-50 text-green-800 border border-green-100"
                    : "bg-gray-50 text-gray-700 border border-gray-100"
                }`}
              >
                <div className="flex items-start gap-2">
                  <span className="text-base shrink-0">{item.icon}</span>
                  <div>
                    <p className="font-medium">{item.title}</p>
                    <p className="text-xs mt-0.5 opacity-90">{item.content}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default function AIInsightsPanel({ className = "" }) {
  const { insights, loading, error, refreshInsights, hasInsights } = useAI();

  return (
    <div className={`bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 mb-8 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <Sparkles size={20} className="text-indigo-600" />
          <h2 className="text-lg font-bold text-gray-900">
            🤖 AI Insights
          </h2>
          {insights.generatedAt && (
            <span className="text-xs text-gray-400">
              Updated {new Date(insights.generatedAt).toLocaleTimeString()}
            </span>
          )}
        </div>

        <button
          onClick={refreshInsights}
          disabled={loading}
          className="flex items-center gap-1.5 text-sm text-indigo-600 hover:text-indigo-700 disabled:opacity-50 transition"
        >
          {loading ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <RefreshCw size={16} />
          )}
          Refresh
        </button>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-4">
          {error}
        </div>
      )}

      {/* Loading State */}
      {loading && !hasInsights && (
        <div className="flex items-center justify-center py-8">
          <Loader2 size={24} className="animate-spin text-indigo-500" />
          <span className="ml-2 text-sm text-gray-500">Generating AI insights...</span>
        </div>
      )}

      {/* Insights Grid */}
      {!loading && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Analysis */}
          <InsightCard
            title="Analysis"
            icon={Brain}
            colorClass="text-blue-600"
            borderColor="border-blue-500"
            items={insights.analysis}
            emptyText="No analysis available yet."
          />

          {/* Suggestions */}
          <InsightCard
            title="Suggestions"
            icon={Lightbulb}
            colorClass="text-amber-600"
            borderColor="border-amber-500"
            items={insights.suggestions}
            emptyText="No suggestions at the moment."
          />

          {/* Alerts */}
          <InsightCard
            title="Alerts"
            icon={AlertTriangle}
            colorClass="text-red-600"
            borderColor="border-red-500"
            items={insights.alerts}
            emptyText="No alerts. Everything looks good!"
          />
        </div>
      )}
    </div>
  );
}

