// Template 2: Modern Gradient - Blue gradient header with logo on right
export const Template2Modern = ({ invoice, user, customer, items }: any) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
    }).format(amount);
  };

  return (
    <div className="bg-white max-w-4xl mx-auto">
      {/* Gradient Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-5xl font-bold mb-2">
              {invoice.documentType === 'QUOTE' ? 'Quote' : 'Invoice'}
            </h1>
            <p className="text-blue-100 text-lg">{invoice.invoiceNumber}</p>
          </div>
          <div className="text-right">
            {user.companyLogo ? (
              <img src={user.companyLogo} alt="Logo" className="h-20 bg-white p-2 rounded" />
            ) : (
              <div className="h-20 w-20 bg-white rounded-lg flex items-center justify-center text-blue-600 text-3xl font-bold">
                {user.companyName?.charAt(0) || user.firstName?.charAt(0)}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="p-8">
        {/* Info Cards */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-xs text-blue-600 font-semibold uppercase mb-1">From</p>
            <p className="font-semibold text-gray-900">{user.companyName || `${user.firstName} ${user.lastName}`}</p>
            <p className="text-sm text-gray-600">{user.email}</p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-xs text-blue-600 font-semibold uppercase mb-1">To</p>
            <p className="font-semibold text-gray-900">{customer.name}</p>
            {customer.email && <p className="text-sm text-gray-600">{customer.email}</p>}
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-xs text-blue-600 font-semibold uppercase mb-1">Dates</p>
            <p className="text-sm">Issued: {new Date(invoice.issueDate).toLocaleDateString()}</p>
            <p className="text-sm">Due: {new Date(invoice.dueDate).toLocaleDateString()}</p>
          </div>
        </div>

        {/* Items Table */}
        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-300">
                <th className="text-left py-3 text-sm font-bold text-gray-700">Item</th>
                <th className="text-center py-3 text-sm font-bold text-gray-700">Qty</th>
                <th className="text-right py-3 text-sm font-bold text-gray-700">Price</th>
                <th className="text-right py-3 text-sm font-bold text-gray-700">Total</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item: any, index: number) => (
                <tr key={index} className="border-b border-gray-200">
                  <td className="py-4">{item.description}</td>
                  <td className="text-center py-4">{item.quantity}</td>
                  <td className="text-right py-4">{formatCurrency(item.unitPrice)}</td>
                  <td className="text-right py-4 font-semibold">{formatCurrency(item.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="flex justify-end">
          <div className="w-80 bg-gradient-to-br from-blue-600 to-blue-800 text-white p-6 rounded-lg">
            <div className="flex justify-between py-2 text-blue-100">
              <span>Subtotal</span>
              <span>{formatCurrency(invoice.subtotal)}</span>
            </div>
            {invoice.taxRate > 0 && (
              <div className="flex justify-between py-2 text-blue-100">
                <span>Tax ({invoice.taxRate}%)</span>
                <span>{formatCurrency(invoice.taxAmount)}</span>
              </div>
            )}
            <div className="flex justify-between py-3 border-t-2 border-blue-400 text-xl font-bold">
              <span>Total Due</span>
              <span>{formatCurrency(invoice.total)}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        {invoice.notes && (
          <div className="mt-8 p-4 bg-gray-50 rounded">
            <p className="text-sm text-gray-600">{invoice.notes}</p>
          </div>
        )}
      </div>
    </div>
  );
};
