// Template 1: Classic Professional - Logo on right, clean lines
export const Template1Classic = ({ invoice, user, customer, items }: any) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
    }).format(amount);
  };

  return (
    <div className="bg-white p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {invoice.documentType === 'QUOTE' ? 'QUOTATION' : 'INVOICE'}
          </h1>
          <p className="text-gray-600">{invoice.invoiceNumber}</p>
        </div>
        <div className="text-right">
          {user.companyLogo ? (
            <img src={user.companyLogo} alt="Logo" className="h-16 mb-2" />
          ) : (
            <div className="h-16 w-16 bg-blue-600 rounded-lg flex items-center justify-center text-white text-2xl font-bold">
              {user.companyName?.charAt(0) || user.firstName?.charAt(0)}
            </div>
          )}
          <p className="font-semibold text-gray-900">{user.companyName || `${user.firstName} ${user.lastName}`}</p>
          <p className="text-sm text-gray-600">{user.email}</p>
        </div>
      </div>

      {/* Details */}
      <div className="grid grid-cols-2 gap-8 mb-8">
        <div>
          <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Bill To</h3>
          <p className="font-semibold text-gray-900">{customer.name}</p>
          {customer.company && <p className="text-gray-600">{customer.company}</p>}
          {customer.email && <p className="text-gray-600">{customer.email}</p>}
        </div>
        <div className="text-right">
          <div className="mb-2">
            <span className="text-sm text-gray-500">Issue Date: </span>
            <span className="font-medium">{new Date(invoice.issueDate).toLocaleDateString()}</span>
          </div>
          <div>
            <span className="text-sm text-gray-500">Due Date: </span>
            <span className="font-medium">{new Date(invoice.dueDate).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      {/* Items */}
      <table className="w-full mb-8">
        <thead>
          <tr className="border-b-2 border-gray-900">
            <th className="text-left py-3 text-sm font-semibold">Description</th>
            <th className="text-right py-3 text-sm font-semibold">Qty</th>
            <th className="text-right py-3 text-sm font-semibold">Rate</th>
            <th className="text-right py-3 text-sm font-semibold">Amount</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item: any, index: number) => (
            <tr key={index} className="border-b border-gray-200">
              <td className="py-3">{item.description}</td>
              <td className="text-right py-3">{item.quantity}</td>
              <td className="text-right py-3">{formatCurrency(item.unitPrice)}</td>
              <td className="text-right py-3">{formatCurrency(item.total)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Totals */}
      <div className="flex justify-end mb-8">
        <div className="w-64">
          <div className="flex justify-between py-2">
            <span className="text-gray-600">Subtotal</span>
            <span className="font-medium">{formatCurrency(invoice.subtotal)}</span>
          </div>
          {invoice.taxRate > 0 && (
            <div className="flex justify-between py-2">
              <span className="text-gray-600">Tax ({invoice.taxRate}%)</span>
              <span className="font-medium">{formatCurrency(invoice.taxAmount)}</span>
            </div>
          )}
          <div className="flex justify-between py-3 border-t-2 border-gray-900">
            <span className="font-bold text-lg">Total</span>
            <span className="font-bold text-lg">{formatCurrency(invoice.total)}</span>
          </div>
        </div>
      </div>

      {/* Notes */}
      {invoice.notes && (
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">Notes</h3>
          <p className="text-sm text-gray-600">{invoice.notes}</p>
        </div>
      )}

      {/* Terms */}
      {invoice.terms && (
        <div className="text-xs text-gray-500 border-t pt-4">
          <p>{invoice.terms}</p>
        </div>
      )}
    </div>
  );
};
