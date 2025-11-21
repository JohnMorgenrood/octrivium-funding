// Template 6: Creative Dark - Dark theme with accent colors
export const Template6Creative = ({ invoice, user, customer, items }: any) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
    }).format(amount);
  };

  return (
    <div className="bg-gray-900 text-white p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-start mb-12">
        <div>
          <h1 className="text-6xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-3">
            {invoice.documentType === 'QUOTE' ? 'Quote' : 'Invoice'}
          </h1>
          <p className="text-gray-400 text-xl">{invoice.invoiceNumber}</p>
        </div>
        <div>
          {user.companyLogo ? (
            <img src={user.companyLogo} alt="Logo" className="h-20 bg-white p-2 rounded-lg" />
          ) : (
            <div className="h-20 w-20 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center text-2xl font-bold">
              {user.companyName?.charAt(0) || user.firstName?.charAt(0)}
            </div>
          )}
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-2 gap-6 mb-12">
        <div className="bg-gray-800 p-6 rounded-lg border border-cyan-500/30">
          <p className="text-cyan-400 text-xs uppercase tracking-wider mb-3">From</p>
          <p className="font-semibold text-lg mb-1">{user.companyName || `${user.firstName} ${user.lastName}`}</p>
          <p className="text-gray-400 text-sm">{user.email}</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg border border-cyan-500/30">
          <p className="text-cyan-400 text-xs uppercase tracking-wider mb-3">To</p>
          <p className="font-semibold text-lg mb-1">{customer.name}</p>
          {customer.email && <p className="text-gray-400 text-sm">{customer.email}</p>}
        </div>
      </div>

      {/* Dates */}
      <div className="flex gap-8 mb-12">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-cyan-500/20 rounded-full flex items-center justify-center">
            <span className="text-cyan-400">📅</span>
          </div>
          <div>
            <p className="text-gray-400 text-xs">Issued</p>
            <p className="font-medium">{new Date(invoice.issueDate).toLocaleDateString()}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
            <span className="text-blue-400">⏰</span>
          </div>
          <div>
            <p className="text-gray-400 text-xs">Due</p>
            <p className="font-medium">{new Date(invoice.dueDate).toLocaleDateString()}</p>
          </div>
        </div>
      </div>

      {/* Items */}
      <div className="bg-gray-800 rounded-lg overflow-hidden mb-8">
        <table className="w-full">
          <thead>
            <tr className="bg-gradient-to-r from-cyan-600 to-blue-600">
              <th className="text-left py-4 px-6 font-semibold">Item</th>
              <th className="text-center py-4 px-6 font-semibold">Qty</th>
              <th className="text-right py-4 px-6 font-semibold">Price</th>
              <th className="text-right py-4 px-6 font-semibold">Total</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item: any, index: number) => (
              <tr key={index} className="border-b border-gray-700">
                <td className="py-4 px-6">{item.description}</td>
                <td className="text-center py-4 px-6 text-gray-300">{item.quantity}</td>
                <td className="text-right py-4 px-6 text-gray-300">{formatCurrency(item.unitPrice)}</td>
                <td className="text-right py-4 px-6 font-semibold text-cyan-400">{formatCurrency(item.total)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Totals */}
      <div className="flex justify-end">
        <div className="w-96 bg-gradient-to-br from-cyan-600 to-blue-600 p-8 rounded-lg">
          <div className="flex justify-between py-2 text-white/80">
            <span>Subtotal</span>
            <span>{formatCurrency(invoice.subtotal)}</span>
          </div>
          {invoice.taxRate > 0 && (
            <div className="flex justify-between py-2 text-white/80">
              <span>Tax ({invoice.taxRate}%)</span>
              <span>{formatCurrency(invoice.taxAmount)}</span>
            </div>
          )}
          <div className="flex justify-between py-4 border-t-2 border-white/30 text-2xl font-bold">
            <span>Total</span>
            <span>{formatCurrency(invoice.total)}</span>
          </div>
        </div>
      </div>

      {invoice.notes && (
        <div className="mt-8 bg-gray-800 p-6 rounded-lg border-l-4 border-cyan-500">
          <p className="text-gray-300">{invoice.notes}</p>
        </div>
      )}
    </div>
  );
};
