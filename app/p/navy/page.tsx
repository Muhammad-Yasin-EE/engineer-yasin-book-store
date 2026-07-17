import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default function NavyPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <section className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-4">Pakistan Navy</h1>
        <p className="text-gray-500">Explore the various branches and preparation resources for the Navy.</p>
      </section>

      {/* Banner Image */}
      <section className="mb-12">
        <Image
          src="/images/exam-navy-bg.jpg"
          alt="Pakistan Navy Banner"
          width={1200}
          height={400}
          className="w-full object-cover rounded-md"
        />
      </section>

      {/* Cards Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {/* General Navy */}
        <Link
          href="/p/navy"
          className="group block bg-white border border-gray-200 p-6 rounded-md hover:border-[#B8212E] hover:shadow-lg transition"
        >
          <Image
            src="/images/navy_general.jpg"
            alt="Pakistan Navy"
            width={400}
            height={250}
            className="w-full h-48 object-cover rounded-md mb-4"
          />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Pakistan Navy</h3>
          <p className="text-gray-600 mb-3">Overall Navy information and resources.</p>
          <span className="inline-flex items-center text-sm text-[#B8212E] font-medium">
            View Materials <ArrowRight className="w-4 h-4 ml-1" />
          </span>
        </Link>

        {/* PN Cadet */}
        <Link
          href="/p/navy/pn-cadet"
          className="group block bg-white border border-gray-200 p-6 rounded-md hover:border-[#B8212E] hover:shadow-lg transition"
        >
          <Image
            src="/images/navy_cadet.jpg"
            alt="PN Cadet"
            width={400}
            height={250}
            className="w-full h-48 object-cover rounded-md mb-4"
          />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">PN Cadet</h3>
          <p className="text-gray-600 mb-3">Materials for the PN Cadet entrance exam.</p>
          <span className="inline-flex items-center text-sm text-[#B8212E] font-medium">
            View Materials <ArrowRight className="w-4 h-4 ml-1" />
          </span>
        </Link>

        {/* Marines */}
        <Link
          href="/p/navy/marines"
          className="group block bg-white border border-gray-200 p-6 rounded-md hover:border-[#B8212E] hover:shadow-lg transition"
        >
          <Image
            src="/images/navy_marines.jpg"
            alt="Navy Marines"
            width={400}
            height={250}
            className="w-full h-48 object-cover rounded-md mb-4"
          />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Marines</h3>
          <p className="text-gray-600 mb-3">Preparation material for Navy Marines.</p>
          <span className="inline-flex items-center text-sm text-[#B8212E] font-medium">
            View Materials <ArrowRight className="w-4 h-4 ml-1" />
          </span>
        </Link>

        {/* Sailor */}
        <Link
          href="/p/navy/sailor"
          className="group block bg-white border border-gray-200 p-6 rounded-md hover:border-[#B8212E] hover:shadow-lg transition"
        >
          <Image
            src="/images/navy_sailor.jpg"
            alt="Navy Sailor"
            width={400}
            height={250}
            className="w-full h-48 object-cover rounded-md mb-4"
          />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Sailor</h3>
          <p className="text-gray-600 mb-3">Resources for aspiring Sailors.</p>
          <span className="inline-flex items-center text-sm text-[#B8212E] font-medium">
            View Materials <ArrowRight className="w-4 h-4 ml-1" />
          </span>
        </Link>

        {/* Civilian */}
        <Link
          href="/p/navy/civilian"
          className="group block bg-white border border-gray-200 p-6 rounded-md hover:border-[#B8212E] hover:shadow-lg transition"
        >
          <Image
            src="/images/navy_civilian.jpg"
            alt="Navy Civilian"
            width={400}
            height={250}
            className="w-full h-48 object-cover rounded-md mb-4"
          />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Civilian</h3>
          <p className="text-gray-600 mb-3">Civilian entry pathways and exam prep.</p>
          <span className="inline-flex items-center text-sm text-[#B8212E] font-medium">
            View Materials <ArrowRight className="w-4 h-4 ml-1" />
          </span>
        </Link>
      </section>
    </div>
  );
}
