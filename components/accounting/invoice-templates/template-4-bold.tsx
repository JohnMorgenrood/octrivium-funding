// Template 4: Bold & Colorful - Purple theme with side logo
export const Template4Bold = ({ invoice, user, customer, items }: any) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
    }).format(amount);
  };

  return (
    <div className="bg-white max-w-4xl mx-auto flex">
      {/* Colored Sidebar */}
      <div className="w-48 bg-gradient-to-b from-purple-600 to-purple-900 text-white p-6 flex flex-col items-center justify-start">
        {user.companyLogo ? (
          <img src={user.companyLogo} alt="Logo" className="h-20 w-20 bg-white p-2 rounded-full mb-4" />
        ) : (
          <div className="h-20 w-20 bg-white rounded-full flex items-center justify-center text-purple-600 text-2xl font-bold mb-4">
            {user.companyName?.charAt(0) || user.firstName?.charAt(0)}
          </div>
        )}
        <p className="text-center text-sm font-semibold mb-1">{user.companyName || `${user.firstName} ${user.lastName}`}</p>
        <p className="text-center text-xs text-purple-200">{user.email}</p>
        
        <div className="mt-8 w-full">
          <div className="bg-purple-800/50 p-3 rounded mb-2">
            <p className="text-xs text-purple-200 mb-1">Issue Date</p>
            <p className="text-sm font-medium">{new Date(invoice.issueDate).toLocaleDateString()}</p>
          </div>
          <div className="bg-purple-800/50 p-3 rounded">
            <p className="text-xs text-purple-200 mb-1">Due Date</p>
            <p className="text-sm font-medium">{new Date(invoice.dueDate).toLocaleDateString()}</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-5xl font-bold text-purple-900 mb-2">
            {invoice.documentType === 'QUOTE' ? 'QUOTATION' : 'INVOICE'}
          </h1>
          <p className="text-xl text-purple-600">{invoice.invoiceNumber}</p>
        </div>

        {/* Customer Info */}
        <div className="bg-purple-50 p-6 rounded-lg mb-8">
          <p className="text-xs text-purple-600 font-semibold uppercase mb-2">Billed To</p>
          <p className="text-lg font-semibold text-gray-900">{customer.name}</p>
          {customer.company && <p className="text-gray-600">{customer.company}</p>}
          {customer.email && <p className="text-gray-600">{customer.email}</p>}
        </div>

        {/* Items */}
        <table className="w-full mb-8">
          <thead>
            <tr className="bg-purple-900 text-white">
              <th className="text-left py-3 px-4 rounded-tl-lg">Item</th>
              <th className="text-center py-3 px-4">Qty</th>
              <th className="text-right py-3 px-4">Price</th>
              <th className="text-right py-3 px-4 rounded-tr-lg">Total</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item: any, index: number) => (
              <tr key={index} className="border-b border-gray-200">
                <td className="py-4 px-4">{item.description}</td>
                <td className="text-center py-4 px-4">{item.quantity}</td>
                <td className="text-right py-4 px-4">{formatCurrency(item.unitPrice)}</td>
                <td className="text-right py-4 px-4 font-semibold">{formatCurrency(item.total)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totals */}
        <div className="flex justify-end">
          <div className="w-72 bg-purple-50 p-6 rounded-lg">
            <div className="flex justify-between py-2 text-gray-700">
              <span>Subtotal</span>
              <span className="font-medium">{formatCurrency(invoice.subtotal)}</span>
            </div>
            {invoice.taxRate > 0 && (
              <div className="flex justify-between py-2 text-gray-700">
                <span>Tax ({invoice.taxRate}%)</span>
                <span className="font-medium">{formatCurrency(invoice.taxAmount)}</span>
              </div>
            )}
            <div className="flex justify-between py-4 border-t-2 border-purple-300 text-xl font-bold text-purple-900">
              <span>Total</span>
              <span>{formatCurrency(invoice.total)}</span>
            </div>
          </div>
        </div>

        {invoice.notes && (
          <div className="mt-8 text-sm text-gray-600 border-l-4 border-purple-600 pl-4">
            {invoice.notes}
          </div>
        )}
      </div>
    </div>
  );
};
