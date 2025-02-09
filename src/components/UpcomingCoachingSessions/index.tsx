import { Box, Divider, Flex, Heading, } from "@chakra-ui/react";
import React, { FC, useEffect, useState } from "react";
import { menApiAuthClient } from "../../clients/mentumm";
import { CoachBooking, CoachType, User } from "../../types";

import { CoachingSessionCard, EmptyCoachingSessionCard } from "../CoachingSessionCard";

interface Iprops {
  id: number;
}
export type TCoachBooking = CoachBooking & { coach: CoachType };

const UpcomingCoachingSessions: FC<Iprops> = ({ id }) => {
  const [upcoming, setUpcoming] = useState<TCoachBooking[]>([]);
  const [past, setPast] = useState<TCoachBooking[]>([]);

  useEffect(() => {
    async function loadUpcoming() {
      const u = await menApiAuthClient().get("/user/upcoming", {
        params: { id },
      });

      setUpcoming(u.data);
    }

    async function loadPast() {
      const p = await menApiAuthClient().get("/user/past", {
        params: { id },
      });
      setPast(p.data);
    }

    loadUpcoming();
  }, [id]);

  return (
    <>
      <Box mb='0.5em' px='1em'>
        <Heading fontWeight="normal" size="sm" mt={12} mb={2} color="white">
          Upcoming Coaching Sessions
        </Heading>
        <Divider borderBottomColor='#2CBBBC' />
      </Box>
      {upcoming.length > 0 ?
        (
          <Box>
            <Flex display="flex" gap={4}>
              {upcoming.map((u) => {
                return (
                  <CoachingSessionCard session={u} isPrevious={false} key={u.event_type_uuid} />
                );
              })}
            </Flex>
          </Box>
        )
        :
        (
          <EmptyCoachingSessionCard />
        )
      }
    </>
  );
};

export default UpcomingCoachingSessions;