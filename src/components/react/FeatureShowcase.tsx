import { motion } from 'motion/react';
import Icon from 'astro-iconset/react';

import cncImg from '@assets/photo-1581091226825-a6a2a5aee158.jpg';
import sheetMetalImg from '@assets/photo-1553413077-190dd305871c.jpg';
import castingImg from '@assets/photo-1563013544-824ae1b704d3.jpg';
import finishingImg from '@assets/photo-1551288049-bebda4e38f71.jpg';
import inspectionImg from '@assets/photo-1486312338219-ce68d2c6f44d.jpg';
import exportImg from '@assets/photo-1451187580459-43490279c0fa.jpg';

const features = [
  {
    icon: 'lucide:cog',
    title: 'CNC Machining',
    description: 'Turning, milling and drilling on 3-axis and 4-axis machining centres, held to ±0.01 mm.',
    image: cncImg,
  },
  {
    icon: 'lucide:layers',
    title: 'Sheet Metal Fabrication',
    description: 'Laser cutting, bending and welding for enclosures, panels, brackets and frames.',
    image: sheetMetalImg,
  },
  {
    icon: 'lucide:hammer',
    title: 'Casting & Moulding',
    description: 'Sand, die and investment casting for housings, covers and machine base parts.',
    image: castingImg,
  },
  {
    icon: 'lucide:droplet',
    title: 'Surface Finishing',
    description: 'Anodising, powder coating, plating and heat treatment for wear and corrosion resistance.',
    image: finishingImg,
  },
  {
    icon: 'lucide:shield-check',
    title: 'Quality Inspection',
    description: 'CMM and manual dimensional checks with inspection reports issued before shipment.',
    image: inspectionImg,
  },
  {
    icon: 'lucide:globe',
    title: 'Export Worldwide',
    description: 'Parts shipped to customers in Europe, North America, the Middle East and Southeast Asia.',
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
