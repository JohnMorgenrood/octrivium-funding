// Template 8: Tech Startup - Modern orange/teal theme with geometric shapes
export const Template8Tech = ({ invoice, user, customer, items }: any) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
    }).format(amount);
  };

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-8 max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header with Geometric Background */}
        <div className="relative bg-gradient-to-r from-orange-500 to-teal-500 p-8 text-white overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24"></div>
          
          <div className="relative z-10 flex justify-between items-start">
            <div>
              <h1 className="text-5xl font-bold mb-2">
                {invoice.documentType === 'QUOTE' ? 'Quote' : 'Invoice'}
              </h1>
              <p className="text-white/90 text-lg">{invoice.invoiceNumber}</p>
            </div>
            <div>
              {user.companyLogo ? (
                <img src={user.companyLogo} alt="Logo" className="h-20 bg-white p-3 rounded-xl shadow-lg" />
              ) : (
                <div className="h-20 w-20 bg-white rounded-xl flex items-center justify-center text-orange-500 text-3xl font-bold shadow-lg">
                  {user.companyName?.charAt(0) || user.firstName?.charAt(0)}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="p-8">
          {/* Info Boxes */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-xl">
              <p className="text-xs text-orange-600 font-bold uppercase mb-2">From</p>
              <p className="font-semibold text-gray-900">{user.companyName || `${user.firstName} ${user.lastName}`}</p>
              <p className="text-sm text-gray-600">{user.email}</p>
            </div>
            <div className="bg-gradient-to-br from-teal-50 to-teal-100 p-4 rounded-xl">
              <p className="text-xs text-teal-600 font-bold uppercase mb-2">To</p>
              <p className="font-semibold text-gray-900">{customer.name}</p>
              {customer.email && <p className="text-sm text-gray-600">{customer.email}</p>}
            </div>
            <div className="bg-gradient-to-br from-gray-100 to-gray-200 p-4 rounded-xl">
              <p className="text-xs text-gray-600 font-bold uppercase mb-2">Dates</p>
              <p className="text-sm font-medium">Issue: {new Date(invoice.issueDate).toLocaleDateString()}</p>
              <p className="text-sm font-medium">Due: {new Date(invoice.dueDate).toLocaleDateString()}</p>
            </div>
          </div>

          {/* Items */}
          <div className="rounded-xl overflow-hidden border-2 border-gray-200 mb-8">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-orange-500 to-teal-500 text-white">
                  <th className="text-left py-4 px-6 font-bold">Item</th>
                  <th className="text-center py-4 px-6 font-bold">Qty</th>
                  <th className="text-right py-4 px-6 font-bold">Price</th>
                  <th className="text-right py-4 px-6 font-bold">Total</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item: any, index: number) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                    <td className="py-4 px-6 font-medium">{item.description}</td>
                    <td className="text-center py-4 px-6 text-gray-600">{item.quantity}</td>
                    <td className="text-right py-4 px-6 text-gray-600">{formatCurrency(item.unitPrice)}</td>
                    <td className="text-right py-4 px-6 font-bold text-teal-600">{formatCurrency(item.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals Card */}
          <div className="flex justify-end">
            <div className="w-96 bg-gradient-to-br from-orange-500 to-teal-500 p-1 rounded-xl">
              <div className="bg-white p-6 rounded-lg">
                <div className="flex justify-between py-2 text-gray-700">
                  <span>Subtotal</span>
                  <span className="font-semibold">{formatCurrency(invoice.subtotal)}</span>
                </div>
                {invoice.taxRate > 0 && (
                  <div className="flex justify-between py-2 text-gray-700">
                    <span>Tax ({invoice.taxRate}%)</span>
                    <span className="font-semibold">{formatCurrency(invoice.taxAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between py-4 border-t-2 border-gray-300 text-2xl font-bold">
                  <span className="bg-gradient-to-r from-orange-500 to-teal-500 bg-clip-text text-transparent">Total</span>
                  <span className="bg-gradient-to-r from-orange-500 to-teal-500 bg-clip-text text-transparent">{formatCurrency(invoice.total)}</span>
                </div>
              </div>
            </div>
          </div>

          {invoice.notes && (
            <div className="mt-8 bg-gradient-to-r from-orange-50 to-teal-50 p-6 rounded-xl border-l-4 border-orange-500">
              <p className="text-sm text-gray-700">{invoice.notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
