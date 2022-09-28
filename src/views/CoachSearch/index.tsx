import {
  Box,
  Heading,
  ListItem,
  Stack,
  UnorderedList,
} from "@chakra-ui/react";

import axios from "axios";
import React, { useEffect, useState } from "react";
//import { createUseStyles, DefaultTheme } from "react-jss";
import { Link, useSearchParams } from "react-router-dom";
import PageWrapper from "../../components/PageWrapper";
import { mixpanelEvent, mixpanelIdentify } from "../../helpers";
import { CurrentUserProps, CoachTag } from "../../types";
import BookingConfirmation from "../BookingConfirmation";

const NODE_API = process.env.REACT_APP_NODE_API;

// const useStyles = createUseStyles((theme: DefaultTheme) => ({
  
// }));

const CATEGORIES = ['Professional', 'Leadership', 'Personal'];

const CoachSearch: React.FC<CurrentUserProps> = ({ currentUser }) => {
  //const classes = useStyles();
  const [coachTags, setCoachTags] = useState<CoachTag[]>();
  
  const [coachBooked, setCoachBooked] = useState<boolean>(null);
  const [searchParams] = useSearchParams();

  const selectTag = (t: CoachTag) => {
    mixpanelEvent("Searched For Tag", {
      "User ID": currentUser ? currentUser.id : null,
      "Tag Slug": t.slug,
      "Tag Name": t.name,
      "Tag ID": t.id,
    });
  };

  const loadTags = async () => {
    // for some reason this fails when redirected from calendly, not sure why
    // doesn't impact anything but a message in console - hopefully we can refactor
    // how calendly is being used in general
    try {
      const tags = await axios.get(`${NODE_API}/v1/tags`);

      if (tags) {
        setCoachTags(tags.data);
      }
    } catch (error) {
      throw new Error("Could not load Coach Tags!");
    }
  };

  useEffect(() => {
    if (!coachTags) {
      loadTags();
    }
  }, [coachTags]);

  useEffect(() => {
    if (currentUser) {
      mixpanelIdentify(String(currentUser.id));
    }
  }, [currentUser]);

  useEffect(() => {
    // these are for the calendly redirect url params
    const event_type_uuid = searchParams.get("event_type_uuid");
    const event_type_name = searchParams.get("event_type_name");
    const event_start_time = searchParams.get("event_start_time");
    const event_end_time = searchParams.get("event_end_time");
    const invitee_uuid = searchParams.get("invitee_uuid");
    const invitee_full_name = searchParams.get("invitee_full_name");
    const invitee_email = searchParams.get("invitee_email");
    const utmSource = searchParams.get("utm_source");

    const bookCoach = async () => {
      try {
        const bookedCoach = await axios.post(`${NODE_API}/v1/user/book-coach`, {
          user_id: currentUser.id,
          coach_id: utmSource,
          event_end_time,
          event_start_time,
          event_type_name,
          event_type_uuid,
          invitee_email,
          invitee_full_name,
          invitee_uuid,
        });

        if (bookedCoach) {
          setCoachBooked(true);
        }
      } catch (error) {
        setCoachBooked(true);
        throw new Error("Could not save booking!");
      }
    };
    console.log(coachBooked, invitee_email)
    if (!coachBooked && invitee_email) {
      bookCoach();
    } else if(!invitee_email) {
      setCoachBooked(false);
    }
  }, [searchParams, coachBooked, currentUser]);

  if(coachBooked) {
    return <BookingConfirmation currentUser={currentUser} />
  }

  return (
    <PageWrapper title="Pick a Topic">
      <Stack direction="row" gap="100px" pl={2}>
        {CATEGORIES.map(c => (
          <Box key={c}>
            <Heading as="h2" size="md" mb={3}>{c}</Heading>
            <UnorderedList>
              {!!coachTags && coachTags.filter(t => t.category === c).sort((a,b) => a.name.localeCompare(b.name)).map(t => <Link key={t.id} to={`/coaches/${t.slug}`} onClick={() => selectTag(t)} ><ListItem mb={2} _hover={{color: '#5DBABD', fontWeight: 'bold'}}>{t.name}</ListItem></Link>)}
            </UnorderedList>
          </Box>
        ))}
      </Stack>
    </PageWrapper>
  );
};

export default CoachSearch;
