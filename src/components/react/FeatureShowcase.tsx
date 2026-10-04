import { motion } from 'motion/react';
import Icon from 'astro-iconset/react';

import cncImg from '@assets/gb/product-filling-4line.jpg';
import sheetMetalImg from '@assets/gb/machine-test-unit.jpg';
import castingImg from '@assets/gb/product-labeling-line.jpg';
import finishingImg from '@assets/gb/product-body-welding.jpg';
import inspectionImg from '@assets/gb/machine-repair-unit.jpg';
import exportImg from '@assets/gb/product-filling-8station.jpg';

const features = [
  {
    icon: 'lucide:cog',
    title: 'Dry Powder Filling Lines',
    description: '3, 4 and 8 station automatic filling lines for 1–8 kg portable units and 25–70 kg wheeled units.',
    image: cncImg,
  },
  {
    icon: 'lucide:layers',
    title: 'Leak Testing & Water Testing',
    description: 'Third-generation leak detection and full-automatic water testing — every cylinder pressure-checked.',
    image: sheetMetalImg,
  },
  {
    icon: 'lucide:hammer',
    title: 'Labelling & Printing',
    description: 'Drying, labelling and multi-colour screen printing finished in one continuous pass.',
    image: castingImg,
  },
  {
    icon: 'lucide:droplet',
    title: 'Cylinder Welding & Handling',
    description: 'Bottle welding plus transfer and orientation mechanisms — no manual handling between stations.',
    image: finishingImg,
  },
  {
    icon: 'lucide:shield-check',
    title: 'Service Workshop Equipment',
    description: 'Powder extraction, refilling, inflation, drying and gauge testing for recharge workshops.',
    image: inspectionImg,
  },
  {
    icon: 'lucide:globe',
    title: 'Export & Installation',
    description: 'Installed and commissioned in South Korea, Indonesia, the Philippines, Vietnam and Ethiopia.',
    image: exportImg,
  },
];

export default function FeatureShowcase() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {features.map((feature, index) => (
        <motion.div
          key={feature.title}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className="group cursor-pointer"
        >
          <div className="relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300">
            {/* Image */}
            <div className="relative h-64 overflow-hidden">
              <motion.img
                src={feature.image.src}
                alt={feature.title}
                className="w-full h-full object-cover"
                loading="lazy"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.4 }}
              />
              <div className="absolute inset-0 bg-linear-to-t from-slate-900 via-slate-900/50 to-transparent opacity-60" />
              
              {/* Icon overlay */}
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 + 0.2 }}
                className="absolute top-4 right-4 w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-lg"
              >
                <Icon name={feature.icon} className="w-6 h-6 text-blue-600" />
              </motion.div>
            </div>

            {/* Content */}
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-sm text-gray-200 opacity-90">{feature.description}</p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
