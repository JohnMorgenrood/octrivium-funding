// Template 5: Corporate Professional - Green theme with structured layout
export const Template5Corporate = ({ invoice, user, customer, items }: any) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
    }).format(amount);
  };

  return (
    <div className="bg-white p-8 max-w-4xl mx-auto">
      {/* Top Bar */}
      <div className="bg-green-700 h-2 mb-8"></div>

      {/* Header */}
      <div className="flex justify-between items-start mb-8 pb-8 border-b-2 border-green-700">
        <div className="flex-1">
          <div className="mb-4">
            {user.companyLogo ? (
              <img src={user.companyLogo} alt="Logo" className="h-16" />
            ) : (
              <div className="h-16 w-16 bg-green-700 flex items-center justify-center text-white text-2xl font-bold">
                {user.companyName?.charAt(0) || user.firstName?.charAt(0)}
              </div>
            )}
          </div>
          <p className="font-bold text-gray-900">{user.companyName || `${user.firstName} ${user.lastName}`}</p>
          <p className="text-sm text-gray-600">{user.email}</p>
        </div>
        <div className="text-right">
          <h1 className="text-4xl font-bold text-green-700 mb-2">
            {invoice.documentType === 'QUOTE' ? 'QUOTE' : 'INVOICE'}
          </h1>
          <div className="bg-green-700 text-white px-4 py-2 inline-block">
            {invoice.invoiceNumber}
          </div>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-2 gap-8 mb-8">
        <div>
          <div className="bg-green-50 p-4 mb-4">
            <h3 className="text-xs font-bold text-green-800 uppercase mb-2">Invoice To</h3>
            <p className="font-semibold text-gray-900">{customer.name}</p>
            {customer.company && <p className="text-gray-700">{customer.company}</p>}
            {customer.email && <p className="text-gray-600 text-sm">{customer.email}</p>}
          </div>
        </div>
        <div>
          <div className="bg-gray-50 p-4">
            <table className="w-full text-sm">
              <tbody>
                <tr>
                  <td className="py-2 text-gray-600 font-semibold">Issue Date:</td>
                  <td className="py-2 text-right">{new Date(invoice.issueDate).toLocaleDateString()}</td>
                </tr>
                <tr>
                  <td className="py-2 text-gray-600 font-semibold">Due Date:</td>
                  <td className="py-2 text-right">{new Date(invoice.dueDate).toLocaleDateString()}</td>
                </tr>
                <tr>
                  <td className="py-2 text-gray-600 font-semibold">Status:</td>
                  <td className="py-2 text-right">
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-semibold">
                      {invoice.status}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Items Table */}
      <table className="w-full mb-8">
        <thead>
          <tr className="bg-green-700 text-white">
            <th className="text-left py-3 px-4 font-semibold">Description</th>
            <th className="text-center py-3 px-4 font-semibold">Qty</th>
            <th className="text-right py-3 px-4 font-semibold">Unit Price</th>
            <th className="text-right py-3 px-4 font-semibold">Amount</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item: any, index: number) => (
            <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
              <td className="py-3 px-4">{item.description}</td>
              <td className="text-center py-3 px-4">{item.quantity}</td>
              <td className="text-right py-3 px-4">{formatCurrency(item.unitPrice)}</td>
              <td className="text-right py-3 px-4 font-semibold">{formatCurrency(item.total)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Summary */}
      <div className="flex justify-end mb-8">
        <div className="w-96">
          <div className="bg-gray-50 p-6">
            <div className="flex justify-between py-2">
              <span className="text-gray-700">Subtotal</span>
              <span className="font-medium">{formatCurrency(invoice.subtotal)}</span>
            </div>
            {invoice.taxRate > 0 && (
              <div className="flex justify-between py-2">
                <span className="text-gray-700">Tax ({invoice.taxRate}%)</span>
                <span className="font-medium">{formatCurrency(invoice.taxAmount)}</span>
              </div>
            )}
            <div className="border-t-2 border-green-700 mt-3 pt-3 flex justify-between">
              <span className="text-xl font-bold text-green-800">Total Due</span>
              <span className="text-xl font-bold text-green-800">{formatCurrency(invoice.total)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      {invoice.notes && (
        <div className="bg-green-50 p-4 border-l-4 border-green-700">
          <p className="text-sm text-gray-700">{invoice.notes}</p>
        </div>
      )}

      {invoice.terms && (
        <div className="mt-4 text-xs text-gray-500">
          <p>{invoice.terms}</p>
        </div>
      )}
    </div>
  );
};
