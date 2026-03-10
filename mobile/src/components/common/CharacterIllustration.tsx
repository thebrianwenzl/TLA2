import React from 'react';
import { Box } from 'native-base';

// Import SVG files
import WelcomeCharacter from '../../assets/characters/welcome-character.svg';
import BusinessPersonMale from '../../assets/characters/business-person-male.svg';
import BusinessPersonFemale from '../../assets/characters/business-person-female.svg';
import StudentMale from '../../assets/characters/student-male.svg';

const characterMap = {
  'welcome': WelcomeCharacter,
  'business-person-male': BusinessPersonMale,
  'business-person-female': BusinessPersonFemale,
  'student-male': StudentMale,
  // Fallback characters for missing ones
  'teacher-male': BusinessPersonMale,
  'teacher-female': BusinessPersonFemale,
  'student-female': StudentMale,
  'professional-finance': BusinessPersonMale,
  'professional-marketing': BusinessPersonFemale,
};

export type CharacterType = keyof typeof characterMap;

interface CharacterIllustrationProps {
  type: CharacterType;
  size?: number;
  style?: any;
}

const CharacterIllustration: React.FC<CharacterIllustrationProps> = ({
  type,
  size = 120,
  style,
}) => {
  const CharacterSvg = characterMap[type];

  if (!CharacterSvg) {
    console.warn(`Character type "${type}" not found`);
    return null;
  }

  return (
    <Box alignItems="center" style={style}>
      <CharacterSvg width={size} height={size} />
    </Box>
  );
};

export default CharacterIllustration;