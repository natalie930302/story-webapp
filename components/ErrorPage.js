export default function ErrorPage({ icon = '❌', title = '載入失敗', buttonText = '返回首頁', onButtonClick }) {
    return (
      <>
        <div className="error-container appear">
          <div className="error-icon">{icon}</div>
          <p className="error-title">{title}</p>
          <button onClick={onButtonClick} className="error-button">
            {buttonText}
          </button>
        </div>

        <style jsx>{`
          .error-container {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            gap: var(--spacing-lg);
            height: 100%;
            text-align: center;
          }

          .error-icon {
            font-size: var(--text-5xl);
          }

          .error-title {
            font-size: var(--text-3xl);
            color: var(--color-text-secondary);
          }

          .error-button {
            font-size: var(--text-lg);
            color: var(--color-white);
            background: var(--gradient-secondary);
            border: none;
            border-radius: var(--radius-sm);
            padding: var(--spacing-md) var(--spacing-lg);
            cursor: pointer;
            box-shadow: var(--shadow-md);
            transition: all var(--transition-smooth);
          }

          .error-button:hover {
            transform: translateY(-2px);
            box-shadow: var(--shadow-lg);
          }
        `}</style>
      </>
    );
}