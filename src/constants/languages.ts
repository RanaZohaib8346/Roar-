export interface Language {
  id: string;
  name: string;
  nativeName: string;
  flag: string;
  description: string;
}

export const SUPPORTED_LANGUAGES: Language[] = [
  { id: 'korean', name: 'Korean', nativeName: '한국어', flag: '🇰🇷', description: 'Your gateway to K-Pop and K-Drama.' },
  { id: 'spanish', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸', description: 'The most popular choice for beginners.' },
  { id: 'french', name: 'French', nativeName: 'Français', flag: '🇫🇷', description: 'The language of romance and culture.' },
  { id: 'german', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪', description: 'Power your career with German.' },
  { id: 'italian', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹', description: 'Art, music, and food.' },
  { id: 'japanese', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵', description: 'Explore the world of Manga and Tech.' },
  { id: 'chinese', name: 'Chinese', nativeName: '中文', flag: '🇨🇳', description: 'The language of the future.' },
  { id: 'arabic', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦', description: 'Rich history and diverse culture.' },
  { id: 'portuguese', name: 'Portuguese', nativeName: 'Português', flag: '🇧🇷', description: 'Warm cultures and vibrant music.' },
  { id: 'russian', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺', description: 'Classic literature and history.' },
  { id: 'turkish', name: 'Turkish', nativeName: 'Türkçe', flag: '🇹🇷', description: 'Experience the bridge of civilizations.' },
  { id: 'hindi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳', description: 'Explore the vibrant Indian culture.' },
  { id: 'vietnamese', name: 'Vietnamese', nativeName: 'Tiếng Việt', flag: '🇻🇳', description: 'The beauty of Southeast Asia.' },
  { id: 'dutch', name: 'Dutch', nativeName: 'Nederlands', flag: '🇳🇱', description: 'Gateway to the Netherlands.' },
  { id: 'greek', name: 'Greek', nativeName: 'Ελληνικά', flag: '🇬🇷', description: 'The origin of wisdom and myth.' },
  { id: 'swedish', name: 'Swedish', nativeName: 'Svenska', flag: '🇸🇪', description: 'Minimalism and Viking history.' },
  { id: 'thai', name: 'Thai', nativeName: 'ไทย', flag: '🇹🇭', description: 'The land of smiles.' },
  { id: 'hebrew', name: 'Hebrew', nativeName: 'עברית', flag: '🇮🇱', description: 'Deep historical roots.' },
  { id: 'polish', name: 'Polish', nativeName: 'Polski', flag: '🇵🇱', description: 'Rich cultural heritage.' },
  { id: 'english', name: 'English', nativeName: 'English (US)', flag: '🇺🇸', description: 'The global language of business and travel.' },
  { id: 'urdu', name: 'Urdu', nativeName: 'اردو', flag: '🇵🇰', description: 'A language of poetry and elegance.' },
  { id: 'indonesian', name: 'Indonesian', nativeName: 'Bahasa Indonesia', flag: '🇮🇩', description: 'Explore the world\'s largest archipelago.' },
  { id: 'bengali', name: 'Bengali', nativeName: 'বাংলা', flag: '🇧🇩', description: 'The sweet language of literature and song.' },
  { id: 'persian', name: 'Persian', nativeName: 'فارسی', flag: '🇮🇷', description: 'The language of Rumi and ancient empires.' },
  { id: 'ukrainian', name: 'Ukrainian', nativeName: 'Українська', flag: '🇺🇦', description: 'A beautiful language with rich resilience.' },
  { id: 'czech', name: 'Czech', nativeName: 'Čeština', flag: '🇨🇿', description: 'The heart of Central Europe.' },
  { id: 'romanian', name: 'Romanian', nativeName: 'Română', flag: '🇷🇴', description: 'The unique Latin language of the East.' },
  { id: 'hungarian', name: 'Hungarian', nativeName: 'Magyar', flag: '🇭🇺', description: 'A unique European linguistic journey.' },
  { id: 'finnish', name: 'Finnish', nativeName: 'Suomi', flag: '🇫🇮', description: 'The language of the thousand lakes.' },
  { id: 'norwegian', name: 'Norwegian', nativeName: 'Norsk', flag: '🇳🇴', description: 'Land of the fjords and northern lights.' },
  { id: 'danish', name: 'Danish', nativeName: 'Dansk', flag: '🇩🇰', description: 'Hygge and modern Nordic culture.' },
  { id: 'filipino', name: 'Filipino', nativeName: 'Tagalog', flag: '🇵🇭', description: 'Vibrant culture and island life.' },
  { id: 'malay', name: 'Malay', nativeName: 'Bahasa Melayu', flag: '🇲🇾', description: 'Gateway to beautiful Malaysia.' },
  { id: 'tamil', name: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳', description: 'One of the world\'s oldest classical languages.' },
  { id: 'telugu', name: 'Telugu', nativeName: 'తెలుగు', flag: '🇮🇳', description: 'The Italian of the East.' },
  { id: 'marathi', name: 'Marathi', nativeName: 'मराठी', flag: '🇮🇳', description: 'Rich history and cultural pride.' },
  { id: 'gujarati', name: 'Gujarati', nativeName: 'ગુજરાતી', flag: '🇮🇳', description: 'Language of commerce and tradition.' },
  { id: 'punjabi', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', flag: '🇮🇳', description: 'Energy, music, and vibrant spirit.' },
  { id: 'swahili', name: 'Swahili', nativeName: 'Kiswahili', flag: '🇰🇪', description: 'Gateway to East Africa\'s spirit.' },
];
