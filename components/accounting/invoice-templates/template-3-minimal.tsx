// Template 3: Minimal Elegance - Clean, spacious design with logo top right
export const Template3Minimal = ({ invoice, user, customer, items }: any) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
    }).format(amount);
  };

  return (
    <div className="bg-white p-12 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-start mb-16">
        <div className="flex-1">
          <h1 className="text-6xl font-light text-gray-900 mb-4">
            {invoice.documentType === 'QUOTE' ? 'Quote' : 'Invoice'}
          </h1>
          <div className="w-20 h-1 bg-gray-900 mb-4"></div>
          <p className="text-2xl text-gray-500">{invoice.invoiceNumber}</p>
        </div>
        <div className="text-right">
          {user.companyLogo ? (
            <img src={user.companyLogo} alt="Logo" className="h-24 mb-4" />
          ) : (
            <div className="h-24 w-24 border-2 border-gray-900 flex items-center justify-center text-4xl font-light">
              {user.companyName?.charAt(0) || user.firstName?.charAt(0)}
            </div>
          )}
        </div>
      </div>

      {/* Details */}
      <div className="grid grid-cols-2 gap-16 mb-16">
        <div>
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">From</h3>
          <p className="text-lg font-medium text-gray-900">{user.companyName || `${user.firstName} ${user.lastName}`}</p>
          <p className="text-gray-600">{user.email}</p>
        </div>
        <div>
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">To</h3>
          <p className="text-lg font-medium text-gray-900">{customer.name}</p>
          {customer.company && <p className="text-gray-600">{customer.company}</p>}
          {customer.email && <p className="text-gray-600">{customer.email}</p>}
        </div>
      </div>

      <div className="flex gap-16 mb-16 text-sm">
        <div>
          <p className="text-gray-400 uppercase tracking-wider mb-1">Issue Date</p>
          <p className="text-gray-900 font-medium">{new Date(invoice.issueDate).toLocaleDateString()}</p>
        </div>
        <div>
          <p className="text-gray-400 uppercase tracking-wider mb-1">Due Date</p>
          <p className="text-gray-900 font-medium">{new Date(invoice.dueDate).toLocaleDateString()}</p>
        </div>
      </div>

      {/* Items */}
      <table className="w-full mb-16">
        <thead>
          <tr className="border-b border-gray-300">
            <th className="text-left py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Description</th>
            <th className="text-right py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Quantity</th>
            <th className="text-right py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Rate</th>
            <th className="text-right py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Amount</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item: any, index: number) => (
            <tr key={index} className="border-b border-gray-100">
              <td className="py-5 text-gray-900">{item.description}</td>
              <td className="text-right py-5 text-gray-600">{item.quantity}</td>
              <td className="text-right py-5 text-gray-600">{formatCurrency(item.unitPrice)}</td>
              <td className="text-right py-5 text-gray-900 font-medium">{formatCurrency(item.total)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Totals */}
      <div className="flex justify-end mb-16">
        <div className="w-80 space-y-3">
          <div className="flex justify-between text-gray-600">
            <span>Subtotal</span>
            <span>{formatCurrency(invoice.subtotal)}</span>
          </div>
          {invoice.taxRate > 0 && (
            <div className="flex justify-between text-gray-600">
              <span>Tax ({invoice.taxRate}%)</span>
              <span>{formatCurrency(invoice.taxAmount)}</span>
            </div>
          )}
          <div className="border-t-2 border-gray-900 pt-3 flex justify-between text-2xl font-light">
            <span>Total</span>
            <span>{formatCurrency(invoice.total)}</span>
          </div>
        </div>
      </div>

      {/* Notes */}
      {invoice.notes && (
        <div className="pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500 leading-relaxed">{invoice.notes}</p>
        </div>
      )}
    </div>
  );
};
