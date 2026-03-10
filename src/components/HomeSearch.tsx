"use client";

import { CommandSearch, SearchTrigger } from "@/components/CommandSearch";
import { useState } from "react";

interface HomeSearchProps {
  projects: Array<{
    slug: string;
    name: string;
    tagline: string | null;
    category: string;
    layer: string;
    logoUrl: string | null;
  }>;
}

export function HomeSearch({ projects }: HomeSearchProps) {
  return (
    <>
      <CommandSearch projects={projects} />
    </>
  );
}
