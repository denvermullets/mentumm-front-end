import React from 'react';
import {
  Tag,
  TagLabel,
} from '@chakra-ui/react'
import { TagIcon } from '../TagIcon';
import { Tag as TagType, CoachType } from '../../types';

export const generateCoachTags = (tags: TagType[], slug: string) => {

  return tags.map(
    (tag) =>
      !!tag && (
        <Tag
          key={tag.id}
          backgroundColor='transparent'
          size="sm"
          color='white'
          border='0.5px solid'
        >
          <TagIcon icon={tag.icon} />
          <TagLabel>{tag.name.toUpperCase()}</TagLabel>
        </Tag>
      )
  );
};

export const getLocationText = (city?: string, state?: string) => {
  if (city && state) {
    return `${city}, ${state}`;
  } else if (city && !state) {
    return city;
  } else if (!city && state) {
    return state;
  }
  return null;
}

export const generateCoachUrl = (coach: CoachType) => {
  const name = `${coach.first_name} ${coach.last_name}`;
  return name.replace(/\W|_/g, "-").toLowerCase() + `-${coach.id}`;
};