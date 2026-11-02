import type { Block } from "@/content/help-center/types";

/**
 * Compact inline marker for a value that is not published yet. The `hint`
 * explains the gap internally and lives in docs/help-center, so no internal
 * wording reaches traders; the article header explains what the chip means.
 */
function Pending({ label }: { label: string }) {
  return (
    <p className="hc-pending-line">
      <span className="hc-chip hc-chip--pending">Pending</span>
      <span>{label}</span>
    </p>
  );
}

export function Blocks({ blocks }: { blocks: Block[] }) {
  return (
    <div className="hc-prose">
      {blocks.map((block, index) => {
        const key = `${block.kind}-${index}`;

        switch (block.kind) {
          case "h":
            return (
              <h3 key={key} className="hc-prose-h">
                {block.text}
              </h3>
            );

          case "p":
            return <p key={key}>{block.text}</p>;

          case "ul":
            return (
              <ul key={key} className="hc-list">
                {block.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            );

          case "ol":
            return (
              <ol key={key} className="hc-list hc-list--numbered">
                {block.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ol>
            );

          case "callout":
            return (
              <div key={key} className={`hc-callout hc-callout--${block.tone}`}>
                {block.title && <b>{block.title}</b>}
                <p>{block.text}</p>
              </div>
            );

          case "formula":
            return (
              <div key={key} className="hc-formula">
                <span>Formula</span>
                <code>{block.text}</code>
              </div>
            );

          case "table":
            return (
              <div key={key} className="hc-table-wrap">
                <table className="hc-table">
                  <thead>
                    <tr>
                      {block.head.map((h) => (
                        <th key={h}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {block.rows.map((row, rowIndex) => (
                      <tr key={`${key}-${rowIndex}`}>
                        {row.map((cell, cellIndex) => (
                          <td key={`${key}-${rowIndex}-${cellIndex}`}>
                            {cell === "Pending" ? (
                              <span className="hc-chip hc-chip--pending">Pending</span>
                            ) : (
                              cell
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );

          case "kv":
            return (
              <dl key={key} className="hc-kv">
                {block.rows.map((row) => (
                  <div className="hc-kv-row" key={row.label}>
                    <dt>{row.label}</dt>
                    <dd>
                      {row.value ? (
                        <>
                          <span className="hc-kv-value">{row.value}</span>
                          {row.note && <small>{row.note}</small>}
                        </>
                      ) : (
                        <span className="hc-chip hc-chip--pending">Pending</span>
                      )}
                    </dd>
                  </div>
                ))}
              </dl>
            );

          case "pending":
            return <Pending key={key} label={block.label} />;

          case "examples":
            return (
              <div key={key} className="hc-examples">
                {block.items.map((item) => (
                  <div className="hc-example" key={item.title}>
                    <b>{item.title}</b>
                    <p>{item.text}</p>
                  </div>
                ))}
              </div>
            );

          default:
            return null;
        }
      })}
    </div>
  );
}
