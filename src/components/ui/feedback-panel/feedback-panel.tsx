import { FeedbackMessage, type FeedbackMessageProps } from "./feedback-message";

interface FeedbackPanelProps {
  className?: string;
  messages?: FeedbackMessageProps[];
}

const defaultMessages: FeedbackMessageProps[] = [
  {
    type: "error",
    message: "Service component must have a name.",
  },
  {
    type: "success",
    message: "Architecture is valid!",
  },
];

export const FeedbackPanel = ({
  className = "",
  messages = defaultMessages,
}: FeedbackPanelProps) => {
  return (
    <footer
      className={`h-28 sm:h-32 border-t border-gray-200 bg-white p-3 sm:p-4 overflow-y-auto shrink-0 ${className}`}
      role="log"
      aria-live="polite"
      aria-label="Validation feedback"
    >
      <header className="flex items-center justify-between mb-2 sm:mb-3">
        <h3 className="font-semibold text-gray-900 text-sm sm:text-base">
          Validation & Feedback
        </h3>
        <span className="text-xs text-gray-500">
          {messages.length} {messages.length === 1 ? "message" : "messages"}
        </span>
      </header>

      <ul className="flex flex-col gap-2" role="list">
        {messages.map((msg, index) => (
          <li key={index}>
            <FeedbackMessage type={msg.type} message={msg.message} />
          </li>
        ))}
      </ul>
    </footer>
  );
};

export default FeedbackPanel;
