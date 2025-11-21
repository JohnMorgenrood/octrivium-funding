// Template 9: Luxury - Premium black and gold theme
export const Template9Luxury = ({ invoice, user, customer, items }: any) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
    }).format(amount);
  };

  return (
    <div className="bg-black p-8 max-w-4xl mx-auto">
      <div className="border-4 border-yellow-600 p-8">
        {/* Header */}
        <div className="flex justify-between items-start mb-12 pb-8 border-b-2 border-yellow-600/50">
          <div>
            {user.companyLogo ? (
              <img src={user.companyLogo} alt="Logo" className="h-24 mb-4 bg-white p-2" />
            ) : (
              <div className="h-24 w-24 bg-gradient-to-br from-yellow-600 to-yellow-800 flex items-center justify-center text-4xl font-bold text-black mb-4">
                {user.companyName?.charAt(0) || user.firstName?.charAt(0)}
              </div>
            )}
            <p className="text-yellow-600 font-semibold text-lg">{user.companyName || `${user.firstName} ${user.lastName}`}</p>
            <p className="text-gray-400 text-sm">{user.email}</p>
          </div>
          <div className="text-right">
            <h1 className="text-6xl font-bold text-yellow-600 mb-3" style={{ fontFamily: 'serif' }}>
              {invoice.documentType === 'QUOTE' ? 'Quote' : 'Invoice'}
            </h1>
            <div className="bg-yellow-600 text-black px-6 py-2 inline-block font-bold">
              {invoice.invoiceNumber}
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="grid grid-cols-2 gap-12 mb-12">
          <div>
            <div className="border-l-4 border-yellow-600 pl-4 mb-6">
              <p className="text-yellow-600 text-xs uppercase tracking-widest mb-2">Billed To</p>
              <p className="text-white font-semibold text-lg">{customer.name}</p>
              {customer.company && <p className="text-gray-300">{customer.company}</p>}
              {customer.email && <p className="text-gray-400 text-sm">{customer.email}</p>}
            </div>
          </div>
          <div className="text-right">
            <div className="space-y-3">
              <div>
                <span className="text-yellow-600 text-sm uppercase tracking-wider">Issue Date: </span>
                <span className="text-white font-medium">{new Date(invoice.issueDate).toLocaleDateString()}</span>
              </div>
              <div>
                <span className="text-yellow-600 text-sm uppercase tracking-wider">Due Date: </span>
                <span className="text-white font-medium">{new Date(invoice.dueDate).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Items */}
        <table className="w-full mb-12">
          <thead>
            <tr className="border-y-2 border-yellow-600 text-yellow-600">
              <th className="text-left py-4 uppercase tracking-wider text-sm">Description</th>
              <th className="text-center py-4 uppercase tracking-wider text-sm">Qty</th>
              <th className="text-right py-4 uppercase tracking-wider text-sm">Rate</th>
              <th className="text-right py-4 uppercase tracking-wider text-sm">Amount</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item: any, index: number) => (
              <tr key={index} className="border-b border-gray-800 text-white">
                <td className="py-4">{item.description}</td>
                <td className="text-center py-4 text-gray-300">{item.quantity}</td>
                <td className="text-right py-4 text-gray-300">{formatCurrency(item.unitPrice)}</td>
                <td className="text-right py-4 font-semibold text-yellow-600">{formatCurrency(item.total)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totals */}
        <div className="flex justify-end mb-8">
          <div className="w-96 border-2 border-yellow-600 p-6 bg-yellow-600/5">
            <div className="flex justify-between py-3 text-gray-300">
              <span>Subtotal</span>
              <span className="text-white font-medium">{formatCurrency(invoice.subtotal)}</span>
            </div>
            {invoice.taxRate > 0 && (
              <div className="flex justify-between py-3 text-gray-300">
                <span>Tax ({invoice.taxRate}%)</span>
                <span className="text-white font-medium">{formatCurrency(invoice.taxAmount)}</span>
              </div>
            )}
            <div className="flex justify-between py-4 border-t-4 border-yellow-600 text-2xl font-bold">
              <span className="text-yellow-600">TOTAL</span>
              <span className="text-yellow-600">{formatCurrency(invoice.total)}</span>
            </div>
          </div>
        </div>

        {/* Notes */}
        {invoice.notes && (
          <div className="border-t-2 border-yellow-600/50 pt-6">
            <p className="text-gray-400 text-sm italic">{invoice.notes}</p>
          </div>
        )}

        {invoice.terms && (
          <div className="mt-6 text-xs text-gray-500">
            <p>{invoice.terms}</p>
          </div>
        )}
      </div>
    </div>
  );
};
