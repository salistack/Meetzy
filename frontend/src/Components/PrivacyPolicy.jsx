import { useState, useEffect } from 'react';

const PrivacyPolicy = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [highlightedSections, setHighlightedSections] = useState([]);

  // Privacy policy content sections
  const policySections = [
    {
      title: 'Information We Collect',
      content: 'We collect personal information you provide when creating an account, such as name, email, and profile details. We also automatically collect data about your device and usage patterns through cookies and similar technologies.'
    },
    {
      title: 'How We Use Your Information',
      content: 'Your information is used to provide and improve our services, communicate with you, ensure platform safety, and personalize your experience. We may use data for analytics, security purposes, and to comply with legal obligations.'
    },
    {
      title: 'Data Sharing and Disclosure',
      content: 'We do not sell your personal data. We may share information with trusted service providers, law enforcement when required, or in connection with business transfers. Aggregate or anonymized data may be shared for analytics.'
    },
    {
      title: 'Data Security',
      content: 'We implement industry-standard security measures including encryption, access controls, and regular security assessments. However, no system is completely secure, so we cannot guarantee absolute security of your information.'
    },
    {
      title: 'Your Rights and Choices',
      content: 'You may access, update, or delete your account information. You can opt out of marketing communications and manage cookie preferences. Some rights may be limited based on your jurisdiction and legitimate business needs.'
    },
    {
      title: 'International Data Transfers',
      content: 'Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place for these transfers in compliance with applicable data protection laws.'
    },
    {
      title: 'Children\'s Privacy',
      content: 'Our services are not directed to children under 13 (or 16 in some jurisdictions). We do not knowingly collect personal information from children. If we become aware of such collection, we will take steps to delete the information.'
    },
    {
      title: 'Changes to This Policy',
      content: 'We may update this policy periodically. We will notify you of significant changes through our platform or via email. Your continued use after changes constitutes acceptance of the updated policy.'
    },
    {
      title: 'Contact Us',
      content: 'For questions about this privacy policy or your personal data, please contact our Data Protection Officer at privacy@meetupcommunity.com or through our support center.'
    }
  ];

  // Highlight search terms in content
  const highlightText = (text) => {
    if (!searchTerm) return text;
    
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    return text.split(regex).map((part, i) => 
      part.toLowerCase() === searchTerm.toLowerCase() 
        ? <mark key={i} className="bg-yellow-200">{part}</mark> 
        : part
    );
  };

  // Filter sections based on search term
  useEffect(() => {
    if (!searchTerm) {
      setHighlightedSections([]);
      return;
    }

    const filtered = policySections.filter(section => 
      section.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      section.content.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setHighlightedSections(filtered);
  }, [searchTerm]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Privacy Policy</h1>
        <p className="text-gray-600">Last updated: {new Date().toLocaleDateString()}</p>
      </div>

      {/* Search functionality */}
      <div className="mb-8 relative">
        <input
          type="text"
          placeholder="Search privacy policy..."
          className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <svg
          className="absolute left-3 top-3.5 h-5 w-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>

      {/* Search results or full policy */}
      {searchTerm ? (
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Search Results for "{searchTerm}"
          </h2>
          {highlightedSections.length > 0 ? (
            highlightedSections.map((section, index) => (
              <div key={index} className="mb-6 p-4 bg-white rounded-lg shadow-sm">
                <h3 className="text-lg font-medium text-blue-600 mb-2">
                  {highlightText(section.title)}
                </h3>
                <p className="text-gray-700">{highlightText(section.content)}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-600">No results found for your search.</p>
          )}
        </div>
      ) : (
        <div className="space-y-8">
          <div className="bg-blue-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-blue-800 mb-2">Our Commitment to Your Privacy</h2>
            <p className="text-blue-700">
              At Meetup & Travel Community, we take your privacy seriously. This policy explains how we collect, 
              use, and protect your personal information when you use our platform. Please read it carefully to 
              understand our practices regarding your data.
            </p>
          </div>

          {policySections.map((section, index) => (
            <div key={index} className="border-b border-gray-200 pb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-3">{section.title}</h2>
              <p className="text-gray-600 leading-relaxed">{section.content}</p>
            </div>
          ))}

          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Need More Information?</h2>
            <p className="text-gray-600 mb-4">
              If you have questions about how we handle your data or want to exercise your privacy rights, 
              don't hesitate to reach out to our privacy team.
            </p>
            <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
              Contact Privacy Team
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PrivacyPolicy;