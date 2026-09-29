import Icon from 'astro-iconset/react';


const stats = [
  { icon: 'lucide:package', title: 'Total Square Footage', value: '2.25M+' },
  { icon: 'lucide:truck', title: 'Delivery Vehicles', value: '200+' },
  { icon: 'lucide:users', title: 'Trained Staff', value: '1,000+' },
  { icon: 'lucide:globe', title: 'Geographic Reach', value: 'Global' }
];

export default function FacilityStats() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      {stats.map((stat, index) => {
        return (
          <div
            key={index}
            className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 text-center group hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 animate-fadeInUp"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-linear-to-br from-blue-500 to-teal-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
              <Icon name={stat.icon} className="w-8 h-8 text-white" />
            </div>
            <div className="text-3xl md:text-4xl font-bold bg-linear-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent mb-2">
              {stat.value}
            </div>
            <div className="text-sm font-medium text-gray-600">{stat.title}</div>
          </div>
        );
      })}
    </div>
  );
}

