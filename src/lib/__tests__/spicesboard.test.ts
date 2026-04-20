import { describe, expect, it } from "vitest";
import { aggregateWeightedApByDate, filterRowsByMinDate, parseSpicesBoardRows } from "@/lib/spicesboard";

describe("parseSpicesBoardRows", () => {
  it("parses structured table rows", () => {
    const html = `
      <table>
        <tr>
          <th>Date of Auction</th><th>Qty Sold</th><th>Avg.Price</th>
        </tr>
        <tr>
          <td>20-04-2026</td><td>1,000</td><td>2,100.50</td>
        </tr>
      </table>
    `;

    const rows = parseSpicesBoardRows(html);
    expect(rows).toHaveLength(1);
    expect(rows[0]?.qtySoldKg).toBe(1000);
    expect(rows[0]?.avgPrice).toBe(2100.5);
  });

  it("falls back when header map is missing", () => {
    const html = `
      <table>
        <tr><td>20-Apr-2026</td><td>500</td><td>2,200</td></tr>
      </table>
    `;

    const rows = parseSpicesBoardRows(html);
    expect(rows).toHaveLength(1);
    expect(rows[0]?.qtySoldKg).toBe(500);
    expect(rows[0]?.avgPrice).toBe(2200);
  });

  it("parses YYYY-MM-DD date format", () => {
    const html = `
      <table>
        <tr><th>Date of Auction</th><th>Qty Sold</th><th>Avg.Price</th></tr>
        <tr><td>2026-04-20</td><td>500</td><td>2210.5</td></tr>
      </table>
    `;

    const rows = parseSpicesBoardRows(html);
    expect(rows).toHaveLength(1);
    expect(rows[0]?.auctionDate.toISOString().slice(0, 10)).toBe("2026-04-20");
  });

  it("ignores malformed rows", () => {
    const html = `
      <table>
        <tr><th>Date of Auction</th><th>Qty Sold</th><th>Avg.Price</th></tr>
        <tr><td>INVALID</td><td>100</td><td>2200</td></tr>
      </table>
    `;

    const rows = parseSpicesBoardRows(html);
    expect(rows).toHaveLength(0);
  });
});

describe("aggregateWeightedApByDate", () => {
  it("computes qty-weighted AP per date", () => {
    const rows = parseSpicesBoardRows(`
      <table>
        <tr><th>Date of Auction</th><th>Qty Sold</th><th>Avg.Price</th></tr>
        <tr><td>20-04-2026</td><td>100</td><td>2000</td></tr>
        <tr><td>20-04-2026</td><td>300</td><td>2400</td></tr>
      </table>
    `);

    const grouped = aggregateWeightedApByDate(rows);
    const day = grouped.get("2026-04-20");

    expect(day?.auctionAvg).toBe(2300);
    expect(day?.rows).toHaveLength(2);
  });
});

describe("filterRowsByMinDate", () => {
  it("keeps rows from min date onwards", () => {
    const rows = parseSpicesBoardRows(`
      <table>
        <tr><th>Date of Auction</th><th>Qty Sold</th><th>Avg.Price</th></tr>
        <tr><td>2014-12-31</td><td>100</td><td>900</td></tr>
        <tr><td>2015-01-01</td><td>100</td><td>1000</td></tr>
      </table>
    `);

    const filtered = filterRowsByMinDate(rows, "2015-01-01");
    expect(filtered).toHaveLength(1);
    expect(filtered[0]?.auctionDate.toISOString().slice(0, 10)).toBe("2015-01-01");
  });
});
