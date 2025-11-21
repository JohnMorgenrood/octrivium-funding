// Template 7: Elegant Serif - Sophisticated design with serif fonts
export const Template7Elegant = ({ invoice, user, customer, items }: any) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
    }).format(amount);
  };

  return (
    <div className="bg-white p-12 max-w-4xl mx-auto" style={{ fontFamily: 'Georgia, serif' }}>
      {/* Decorative Top Line */}
      <div className="border-t-4 border-double border-gray-800 pt-8 mb-8"></div>

      {/* Header */}
      <div className="text-center mb-12">
        {user.companyLogo ? (
          <img src={user.companyLogo} alt="Logo" className="h-24 mx-auto mb-4" />
        ) : (
          <div className="h-24 w-24 border-4 border-double border-gray-800 mx-auto flex items-center justify-center text-4xl font-serif mb-4">
            {user.companyName?.charAt(0) || user.firstName?.charAt(0)}
          </div>
        )}
        <h1 className="text-5xl font-serif mb-2 text-gray-900">
          {invoice.documentType === 'QUOTE' ? 'Quotation' : 'Invoice'}
        </h1>
        <p className="text-xl text-gray-600">{invoice.invoiceNumber}</p>
      </div>

      {/* Details */}
      <div className="grid grid-cols-3 gap-8 mb-12 text-center">
        <div className="border-r border-gray-300 pr-6">
          <p className="text-xs uppercase tracking-widest text-gray-500 mb-3">From</p>
          <p className="font-semibold text-gray-900">{user.companyName || `${user.firstName} ${user.lastName}`}</p>
          <p className="text-sm text-gray-600 mt-1">{user.email}</p>
        </div>
        <div className="border-r border-gray-300">
          <p className="text-xs uppercase tracking-widest text-gray-500 mb-3">To</p>
          <p className="font-semibold text-gray-900">{customer.name}</p>
          {customer.email && <p className="text-sm text-gray-600 mt-1">{customer.email}</p>}
        </div>
        <div className="pl-6">
          <p className="text-xs uppercase tracking-widest text-gray-500 mb-3">Dates</p>
          <p className="text-sm text-gray-700">Issued: {new Date(invoice.issueDate).toLocaleDateString()}</p>
          <p className="text-sm text-gray-700 mt-1">Due: {new Date(invoice.dueDate).toLocaleDateString()}</p>
        </div>
      </div>

      {/* Items */}
      <table className="w-full mb-12">
        <thead>
          <tr className="border-y-2 border-gray-800">
            <th className="text-left py-4 text-sm uppercase tracking-widest text-gray-700">Description</th>
            <th className="text-center py-4 text-sm uppercase tracking-widest text-gray-700">Qty</th>
            <th className="text-right py-4 text-sm uppercase tracking-widest text-gray-700">Rate</th>
            <th className="text-right py-4 text-sm uppercase tracking-widest text-gray-700">Amount</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item: any, index: number) => (
            <tr key={index} className="border-b border-gray-200">
              <td className="py-4 text-gray-900">{item.description}</td>
              <td className="text-center py-4 text-gray-700">{item.quantity}</td>
              <td className="text-right py-4 text-gray-700">{formatCurrency(item.unitPrice)}</td>
              <td className="text-right py-4 font-semibold text-gray-900">{formatCurrency(item.total)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Totals */}
      <div className="flex justify-end mb-12">
        <div className="w-96 border-t-2 border-b-2 border-gray-800 py-6">
          <div className="flex justify-between py-2 text-gray-700">
            <span>Subtotal</span>
            <span>{formatCurrency(invoice.subtotal)}</span>
          </div>
          {invoice.taxRate > 0 && (
            <div className="flex justify-between py-2 text-gray-700">
              <span>Tax ({invoice.taxRate}%)</span>
              <span>{formatCurrency(invoice.taxAmount)}</span>
            </div>
          )}
          <div className="flex justify-between py-3 border-t border-gray-400 mt-3 text-2xl font-serif">
            <span>Total</span>
            <span>{formatCurrency(invoice.total)}</span>
          </div>
        </div>
      </div>

      {/* Notes */}
      {invoice.notes && (
        <div className="text-center border-t border-gray-300 pt-8">
          <p className="text-sm text-gray-600 italic max-w-2xl mx-auto">{invoice.notes}</p>
        </div>
      )}

      {/* Decorative Bottom Line */}
      <div className="border-b-4 border-double border-gray-800 mt-8"></div>
    </div>
  );
};
