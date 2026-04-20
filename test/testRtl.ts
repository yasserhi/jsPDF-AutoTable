import { jsPDF } from 'jspdf'
import autoTable from '../src/main'
const assert = require('assert')

describe('rtl', () => {
  it('rtl columns and alignment', () => {
    const doc = new jsPDF()
    const tableWidth = 100
    const margin = 40
    autoTable(doc, {
      head: [['المعرف', 'الاسم']],
      body: [['١', 'أحمد']],
      rtl: true,
      tableWidth: tableWidth,
      margin: { left: margin },
      didDrawCell: (data) => {
        if (data.section === 'body') {
            if (data.column.index === 0) {
                const expectedX = margin + tableWidth - data.column.width
                assert.equal(Math.round(data.cell.x), Math.round(expectedX), 'Column 0 should be on the right')
            } else if (data.column.index === 1) {
                const expectedX = margin + tableWidth - data.table.columns[0].width - data.table.columns[1].width
                assert.equal(Math.round(data.cell.x), Math.round(expectedX), 'Column 1 should be to the left of column 0')
            }
            assert.equal(data.cell.styles.halign, 'right', 'Default halign should be right in RTL mode')
        }
      }
    })
  })

  it('rtl false (default) behavior', () => {
    const doc = new jsPDF()
    const margin = 40
    autoTable(doc, {
      body: [['c1', 'c2']],
      rtl: false,
      margin: { left: margin },
      didDrawCell: (data) => {
        if (data.section === 'body') {
            if (data.column.index === 0) {
                assert.equal(Math.round(data.cell.x), margin, 'Column 0 should be on the left')
            }
            assert.equal(data.cell.styles.halign, 'left', 'Default halign should be left in LTR mode')
        }
      }
    })
  })

  it('rtl explicit cell override', () => {
    const doc = new jsPDF()
    autoTable(doc, {
      body: [[{ content: 'أحمد', styles: { rtl: true } }]],
      rtl: false, // Table-wide RTL is off
      didDrawCell: (data) => {
        assert.equal(data.cell.styles.rtl, true, 'Cell should have explicit RTL style')
      },
    })
  })

  it('mixed rtl/ltr automatic detection', () => {
    const doc = new jsPDF()
    autoTable(doc, {
      body: [['English أحمد']],
      didDrawCell: (data) => {
        // This is harder to verify without intercepting doc.text calls,
        // but we can at least ensure the code doesn't crash and the style is parsed.
        assert.equal(typeof data.cell.text[0], 'string')
      },
    })
  })
})
