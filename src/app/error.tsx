'use client'
import { errorCardData } from "@/data/content-data";
import { Button, Card, CardBody } from "@nextui-org/react";
import { useEffect } from "react";
import { tv } from 'tailwind-variants';

const errorCard = tv({
  slots: {
    buttonWrapper: 'w-1/4 text-white rounded-md bg-gradient-to-r from-blue-500 via-blue-400 to-blue-300',
    cardWrapper: 'flex justify-center items-center w-1/2 h-3/5',
    cardBodyWrapper: 'flex flex-col items-center justify-center',
    headingWrapper: 'text-6xl font-bold',
    subHeadingWrapper: 'text-2xl mb-4',
  }
});

const { buttonWrapper, cardWrapper, cardBodyWrapper, headingWrapper, subHeadingWrapper } = errorCard();

export default function Error({
  error,
  reset,
}: {
  error: Error
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex justify-center items-center h-screen">
      <Card className={cardWrapper()}>
        <CardBody className={cardBodyWrapper()}>
          <h1 className={headingWrapper()}>Oops!</h1>
          <h2 className={subHeadingWrapper()}>404 - Something went wrong</h2>
          <p className="text-left w-3/4">{errorCardData}</p>
          <Button onPress={() => reset()} className={`${buttonWrapper()}`}>Reload</Button>
        </CardBody>
      </Card>
    </div>
  )
}
