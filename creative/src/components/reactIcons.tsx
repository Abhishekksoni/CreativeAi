const EmojiIcon = ({ emoji }) => (
    <span
      dangerouslySetInnerHTML={{
        __html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
          <text y=".9em" font-size="90">${emoji}</text>
        </svg>`,
      }}
      style={{ width: "24px", height: "24px", display: "inline-block" }}
    />
  );
  
  export default EmojiIcon;
  