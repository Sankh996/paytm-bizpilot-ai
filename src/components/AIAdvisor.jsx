import React, { useState, useRef, useEffect } from 'react';

/**
 * AIAdvisor Component
 *
 * Conversational AI Business Advisor interface for merchants.
 *
 * Secure Architecture:
 * - Calls backend POST /api/chat.
 * - Sends only compact business metrics.
 * - Never sends raw transactions.
 * - API keys remain strictly server-side.
 *
 * UI Enhancement:
 * - Converts AI's structured business response into readable sections.
 * - Supports Verified Data, Business Interpretation and Suggested Actions.
 * - Works with English, Bengali and code-mixed responses.
 */
export default function AIAdvisor({ metrics, alerts, merchantProfile }) {
  const [messages, setMessages] = useState([
    {
      id: 'welcome-1',
      sender: 'ai',
      text: `Namaste! I am BizPilot AI, your retail copilot for ${merchantProfile.businessName}. I have analyzed your 30-day sales, category trends, and payment patterns. Ask me anything about your store performance or pick a suggested topic below!`,
      timestamp: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
      })
    }
  ]);

  const [inputQuestion, setInputQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  // Ref for the chat's own scrollable container.
  // This prevents the whole dashboard page from scrolling.
  const messagesContainerRef = useRef(null);

  // Auto-scroll only inside the chat message area
  useEffect(() => {
    const container = messagesContainerRef.current;

    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, [messages, isLoading]);

  const suggestedQuestions = [
    'Why are my sales falling?',
    'Which category needs attention?',
    'What should I do this week?',
    'How are repeat customers performing?'
  ];

  /**
   * Converts AI markdown-like text into structured UI.
   *
   * The backend intentionally returns plain text.
   * We format only the presentation here.
   */
  const renderAIResponse = (text) => {
    if (!text) return null;

    // Remove escaped markdown characters sometimes returned by the model.
    const cleanText = text
      .replace(/\\\*\*/g, '**')
      .replace(/\\\*/g, '*')
      .replace(/\r\n/g, '\n')
      .trim();

    /*
     * Detect our three business sections.
     *
     * Supports formats such as:
     * [Verified Data]
     * **[Verified Data]:**
     * [Verified Data]&#58;      */
    const sectionRegex =
      /(?:\*\*)?\s*\[?(Verified Data|Business Interpretation|Suggested Actions)\]?\s*:?\s*(?:\*\*)?/gi;

    const matches = [...cleanText.matchAll(sectionRegex)];

    // If no known sections exist, show readable paragraphs instead.
    if (matches.length === 0) {
      return renderGenericAIText(cleanText);
    }

    const sections = [];

    // Optional intro before first section
    const intro = cleanText.slice(0, matches[0].index).trim();

    if (intro) {
      sections.push(
        <div key="intro" className="ai-response-intro">
          {renderGenericAIText(intro)}
        </div>
      );
    }

    matches.forEach((match, index) => {
      const sectionName = match[1];

      const start = match.index + match[0].length;

      const end =
        index + 1 < matches.length
          ? matches[index + 1].index
          : cleanText.length;

      const sectionContent = cleanText
        .slice(start, end)
        .trim();

      const normalizedName = sectionName.toLowerCase();

      let sectionClass = 'ai-response-section';
      let icon = '💡';

      if (normalizedName === 'verified data') {
        sectionClass += ' verified';
        icon = '📊';
      } else if (normalizedName === 'business interpretation') {
        sectionClass += ' interpretation';
        icon = '🔎';
      } else if (normalizedName === 'suggested actions') {
        sectionClass += ' actions';
        icon = '🚀';
      }

      sections.push(
        <div
          key={`${sectionName}-${index}`}
          className={sectionClass}
        >
          <div className="ai-section-heading">
            <span className="ai-section-icon">{icon}</span>
            <span>{sectionName}</span>
          </div>

          <div className="ai-section-content">
            {renderGenericAIText(sectionContent)}
          </div>
        </div>
      );
    });

    return (
      <div className="ai-structured-response">
        {sections}
      </div>
    );
  };

  /**
   * Generic text formatter.
   *
   * Handles:
   * - bullet points
   * - numbered lists
   * - bold markdown
   * - normal paragraphs
   */
  const renderGenericAIText = (text) => {
    if (!text) return null;

    const lines = text
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean);

    const elements = [];
    let currentList = [];
    let listType = null;

    const flushList = () => {
      if (currentList.length === 0) return;

      const ListTag = listType === 'ordered' ? 'ol' : 'ul';

      elements.push(
        <ListTag
          key={`list-${elements.length}`}
          className="ai-response-list"
        >
          {currentList.map((item, index) => (
            <li key={index}>
              {formatInlineText(item)}
            </li>
          ))}
        </ListTag>
      );

      currentList = [];
      listType = null;
    };

    lines.forEach((line) => {
      // Bullet list
      if (/^[-•*]\s+/.test(line)) {
        const content = line.replace(/^[-•*]\s+/, '');

        if (listType && listType !== 'unordered') {
          flushList();
        }

        listType = 'unordered';
        currentList.push(content);
        return;
      }

      // Numbered list
      if (/^\d+[.)]\s+/.test(line)) {
        const content = line.replace(/^\d+[.)]\s+/, '');

        if (listType && listType !== 'ordered') {
          flushList();
        }

        listType = 'ordered';
        currentList.push(content);
        return;
      }

      // Normal paragraph
      flushList();

      elements.push(
        <p key={`paragraph-${elements.length}`}>
          {formatInlineText(line)}
        </p>
      );
    });

    flushList();

    return <>{elements}</>;
  };

  /**
   * Handles simple bold markdown without adding a dependency.
   */
  const formatInlineText = (text) => {
    if (!text) return null;

    const parts = text.split(/(\*\*.*?\*\*)/g);

    return parts.map((part, index) => {
      if (
        part.startsWith('**') &&
        part.endsWith('**')
      ) {
        return (
          <strong key={index}>
            {part.slice(2, -2)}
          </strong>
        );
      }

      return part;
    });
  };

  /**
   * Builds compact, deterministic analytics context.
   *
   * IMPORTANT:
   * Raw transactions are never sent to the LLM.
   */
  const buildCompactContext = () => {
    return {
      merchantName: merchantProfile.businessName,
      location: merchantProfile.location,
      reportingPeriod: 'Last 30 Days (Aug 25 - Sep 23, 2026)',

      totalRevenue: metrics.totalRevenue,

      totalTransactions:
        metrics.totalTransactions,

      averageOrderValue:
        metrics.averageValue,

      categoryPerformance:
        metrics.categoryBreakdown.map((c) => ({
          category: c.category,
          revenue: c.revenue,
          share: `${c.percentage}%`,
          itemsCount: c.count
        })),

      paymentMethodDistribution:
        metrics.paymentBreakdown.map((p) => ({
          method: p.method,
          share: `${p.percentage}%`,
          revenue: p.revenue
        })),

      customerLoyalty: {
        repeatRate:
          `${metrics.customerBreakdown.repeatPercentage}%`,

        repeatCustomers:
          metrics.customerBreakdown.repeatCount,

        newCustomers:
          metrics.customerBreakdown.newCount,

        repeatSpendAvg:
          metrics.customerBreakdown.repeatCount > 0
            ? Math.round(
                metrics.customerBreakdown.repeatRevenue /
                metrics.customerBreakdown.repeatCount
              )
            : 0,

        newSpendAvg:
          metrics.customerBreakdown.newCount > 0
            ? Math.round(
                metrics.customerBreakdown.newRevenue /
                metrics.customerBreakdown.newCount
              )
            : 0
      },

      peakTradingHour:
        metrics.peakHours.peakHour
          ? metrics.peakHours.peakHour.label
          : '20:00 - 22:00',

      businessAlerts:
        alerts.map((a) => ({
          title: a.title,
          message: a.message,
          category: a.category,
          percentageDrop:
            a.metrics?.percentageChange,
          recommendedAction:
            a.suggestedAction
        }))
    };
  };

  /**
   * Sends merchant question to backend.
   */
  const handleSend = async (questionText) => {
    const query =
      (questionText || inputQuestion).trim();

    if (!query || isLoading) return;

    setErrorMessage(null);

    const userTimestamp =
      new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
      });

    const userMsg = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: userTimestamp
    };

    setMessages((prev) => [
      ...prev,
      userMsg
    ]);

    setInputQuestion('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',

        headers: {
          'Content-Type': 'application/json'
        },

        body: JSON.stringify({
          question: query,
          businessContext:
            buildCompactContext()
        })
      });

      if (!response.ok) {
        throw new Error(
          `Server returned status HTTP ${response.status}`
        );
      }

      const data = await response.json();

      const aiTimestamp =
        new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit'
        });

      const aiReplyMsg = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text:
          data.reply ||
          'No response returned from advisor.',
        timestamp: aiTimestamp,
        isConfigNotice:
          data.status === 'not_configured'
      };

      setMessages((prev) => [
        ...prev,
        aiReplyMsg
      ]);

    } catch (err) {
      console.error(
        'Failed to query BizPilot AI server:',
        err
      );

      setErrorMessage(
        'Unable to reach the BizPilot backend service. Ensure the Node.js server is running on port 3001.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Enter = Send
   * Shift + Enter = New line
   */
  const handleKeyDown = (e) => {
    if (
      e.key === 'Enter' &&
      !e.shiftKey
    ) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="dashboard-card ai-advisor-card">

      {/* AI Header */}
      <div className="ai-advisor-header">

        <div className="ai-header-title-wrap">

          <div className="ai-avatar-badge">
            🤖
          </div>

          <div>
            <div className="ai-title-row">

              <h3 className="ai-title">
                BizPilot AI
              </h3>

              <span className="ai-model-tag">
                Sarvam-105B
              </span>

            </div>

            <p className="ai-subtitle">
              Your AI Business Advisor
            </p>
          </div>

        </div>

        <div className="ai-disclaimer-pill">
          <span className="sparkle-icon">
            ✨
          </span>

          AI-generated business guidance based on
          demo transaction analytics
        </div>

      </div>

      {/* Suggested Questions */}
      <div className="suggested-chips-container">

        <span className="chips-label">
          Suggested Inquiries:
        </span>

        <div className="chips-scroll">

          {suggestedQuestions.map((q) => (
            <button
              key={q}
              type="button"
              className="chip-btn"
              onClick={() => handleSend(q)}
              disabled={isLoading}
            >
              {q}
            </button>
          ))}

        </div>

      </div>

      {/* Chat Messages */}
      <div
        ref={messagesContainerRef}
        className="chat-messages-area"
      >

        {messages.map((msg) => (

          <div
            key={msg.id}
            className={`chat-message-wrapper ${msg.sender}`}
          >

            <div className="message-avatar">
              {msg.sender === 'ai'
                ? '🤖'
                : '👤'}
            </div>

            <div
              className={`message-bubble ${msg.sender} ${
                msg.isConfigNotice
                  ? 'config-notice'
                  : ''
              }`}
            >

              <div className="message-header-row">

                <span className="message-sender-name">
                  {msg.sender === 'ai'
                    ? 'BizPilot AI'
                    : 'You (Merchant)'}
                </span>

                <span className="message-time">
                  {msg.timestamp}
                </span>

              </div>

              {/* Structured AI response */}
              <div className="message-text">

                {msg.sender === 'ai'
                  ? renderAIResponse(msg.text)
                  : msg.text}

              </div>

              {/* Configuration guidance */}
              {msg.isConfigNotice && (
                <div className="config-guidance-box">

                  <div className="config-guide-title">
                    ⚙️ Backend Scaffolding Ready
                  </div>

                  <p>
                    The server received your question
                    and analytics context successfully.
                    To connect Sarvam AI, configure
                    <code> SARVAM_API_KEY </code>
                    in the project's
                    <code> .env </code>
                    file.
                  </p>

                </div>
              )}

            </div>

          </div>

        ))}

        {/* Loading indicator */}
        {isLoading && (
          <div className="chat-message-wrapper ai">

            <div className="message-avatar">
              🤖
            </div>

            <div className="message-bubble ai loading-bubble">

              <span className="thinking-text">
                BizPilot is analyzing store KPIs...
              </span>

              <div className="typing-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>

            </div>

          </div>
        )}

      </div>

      {/* Error Banner */}
      {errorMessage && (
        <div className="chat-error-banner">

          <span>
            ⚠️ {errorMessage}
          </span>

          <button
            type="button"
            onClick={() =>
              setErrorMessage(null)
            }
            className="error-dismiss-btn"
            aria-label="Dismiss error"
          >
            ✕
          </button>

        </div>
      )}

      {/* Input */}
      <div className="chat-input-bar">

        <textarea
          rows={1}
          placeholder="Ask BizPilot a business question (e.g. 'Why are beverage sales falling?')..."
          value={inputQuestion}
          onChange={(e) =>
            setInputQuestion(e.target.value)
          }
          onKeyDown={handleKeyDown}
          disabled={isLoading}
          className="chat-textarea"
        />

        <button
          type="button"
          onClick={() => handleSend()}
          disabled={
            !inputQuestion.trim() ||
            isLoading
          }
          className="chat-send-btn"
        >
          <span>Send</span>
          <span className="send-icon">
            ➤
          </span>
        </button>

      </div>

    </div>
  );
}