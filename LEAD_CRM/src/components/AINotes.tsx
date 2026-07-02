import { useState } from 'react';
import { Sparkles, Copy, CheckCircle, AlertCircle, Clock } from 'lucide-react';

interface AINotesProps {
  isLoading?: boolean;
}

interface AISummary {
  summary: string;
  actionItems: string[];
  priority: 'low' | 'medium' | 'high';
}

export function AINotes({ isLoading }: AINotesProps) {
  const [notes, setNotes] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [summary, setSummary] = useState< AISummary | null>(null);

  const generateSummary = async () => {
    if (!notes.trim()) return;

    setIsGenerating(true);

    // Simulate AI processing
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Generate mock summary based on content
    const lines = notes.split('\n').filter((l) => l.trim());
    const mockSummary: AISummary = {
      summary: lines.length > 0
        ? `Key discussion points: ${lines.slice(0, 2).join('; ').substring(0, 100)}...`
        : 'No significant discussion points identified.',
      actionItems: [
        'Schedule follow-up meeting with client',
        'Send proposal document by end of week',
        'Research competitor pricing options',
      ],
      priority: notes.toLowerCase().includes('urgent') || notes.toLowerCase().includes('important') ? 'high' : 'medium',
    };

    setSummary(mockSummary);
    setIsGenerating(false);
  };

  const priorityColors = {
    low: 'bg-secondary/10 text-secondary',
    medium: 'bg-warning/10 text-warning',
    high: 'bg-danger/10 text-danger',
  };

  const priorityIcons = {
    low: Clock,
    medium: AlertCircle,
    high: CheckCircle,
  };

  if (isLoading) {
    return (
      <div className="bg-card border border-border rounded-lg p-6 mb-8">
        <div className="h-6 bg-border rounded w-32 mb-4 animate-pulse"></div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-64 bg-background rounded animate-pulse"></div>
          <div className="h-64 bg-background rounded animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg p-6 mb-8">
      <h2 className="text-lg font-semibold text-text mb-6">AI Meeting Notes</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-text">Meeting Notes</label>
            <span className="text-xs text-secondary">{notes.length} characters</span>
          </div>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Paste or type your meeting notes here... Include key discussion points, client concerns, and any action items mentioned."
            className="w-full h-56 p-4 bg-background border border-border rounded-lg text-sm resize-none focus:outline-none focus:border-primary transition-colors placeholder:text-secondary/60"
          />
          <button
            onClick={generateSummary}
            disabled={isGenerating || !notes.trim()}
            className={`w-48 flex items-center justify-center gap-2 px-4 py-2.5 rounded text-sm font-medium transition-colors ${
              isGenerating || !notes.trim()
                ? 'bg-border text-secondary cursor-not-allowed'
                : 'bg-primary text-white hover:bg-primary/90'
            }`}
          >
            <Sparkles size={16} />
            {isGenerating ? 'Generating...' : 'Generate Summary'}
          </button>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-text">AI Summary</label>
            {summary && (
              <button
                onClick={() => navigator.clipboard.writeText(summary.summary)}
                className="text-xs text-secondary hover:text-primary transition-colors flex items-center gap-1"
              >
                <Copy size={12} />
                Copy
              </button>
            )}
          </div>
          <div className="h-56 bg-background border border-border rounded-lg p-4 overflow-auto">
            {isGenerating ? (
              <div className="flex items-center justify-center h-full">
                <div className="flex items-center gap-2 text-secondary">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent"></div>
                  <span className="text-sm">Analyzing notes...</span>
                </div>
              </div>
            ) : summary ? (
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-secondary uppercase tracking-wider mb-2">Summary</p>
                  <p className="text-sm text-text leading-relaxed">{summary.summary}</p>
                </div>
                <div>
                  <p className="text-xs text-secondary uppercase tracking-wider mb-2">Action Items</p>
                  <ul className="text-sm text-text space-y-1.5">
                    {summary.actionItems.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle size={14} className="text-success mt-0.5 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-secondary uppercase tracking-wider mb-1">Priority</p>
                    <span className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full ${priorityColors[summary.priority]}`}>
                      {(() => {
                        const Icon = priorityIcons[summary.priority];
                        return <Icon size={12} />;
                      })()}
                      {summary.priority.charAt(0).toUpperCase() + summary.priority.slice(1)}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-secondary">
                <p className="text-sm text-center">Summary will appear here after generation</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
