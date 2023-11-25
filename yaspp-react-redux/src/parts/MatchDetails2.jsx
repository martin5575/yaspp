import React, { useState } from 'react';
import {
    Card,CardBody, CardTitle,
  Carousel,
  CarouselItem,
  CarouselControl,
  CarouselIndicators,
  CarouselCaption,
} from 'reactstrap';
import { MatchDetailsHeatmap } from './MatchDetailsHeatmap'
import { MatchDetailsTop3 } from './MatchDetailsTop3'
import { MatchDetailsKicktippTop3 } from './MatchDetailsKicktippTop3'
import { MatchDetailsPlusMinus } from './MatchDetailsPlusMinus'
import { MatchDetailsStats } from './MatchDetailsStats'

const items = [
  {
    id: 1,
    altText: 'Slide 1',
    caption: 'Slide 1',
  },
  {
    id: 2,
    altText: 'Slide 2',
    caption: 'Slide 2',
  },
  {
    id: 3,
    altText: 'Slide 3',
    caption: 'Slide 3',
  },
];

const logoSize = 20;

export function MatchDetails2(props) {
    const teams = props.teams;
    const match = props.match;
    const seasonInfo = props.seasonInfo;
    const stats = props.stats;
    const modelKey = props.modelKey;
    if (!teams || !match || !seasonInfo) return <div>empty</div>

    const teamHome = teams[match.teamHomeId]
    const teamAway = teams[match.teamAwayId]

  const [activeIndex, setActiveIndex] = useState(0);
  const [animating, setAnimating] = useState(false);

  const next = () => {
    if (animating) return;
    const nextIndex = activeIndex === items.length - 1 ? 0 : activeIndex + 1;
    setActiveIndex(nextIndex);
  };

  const previous = () => {
    if (animating) return;
    const nextIndex = activeIndex === 0 ? items.length - 1 : activeIndex - 1;
    setActiveIndex(nextIndex);
  };

  const goToIndex = (newIndex) => {
    if (animating) return;
    setActiveIndex(newIndex);
  };



  const slides= [
      <CarouselItem
        className="custom-tag"
        tag="div"
        key={"1"}
        onExiting={() => setAnimating(true)}
        onExited={() => setAnimating(false)}
      >
        <CarouselCaption 
        captionText="Stats"></CarouselCaption>
        <div className='d-flex-column justify-content-around'>
          <div className='d-flex justify-content-around p-4'>
            <MatchDetailsStats className="mt-3" teams={teams} match={match} seasonInfo={seasonInfo} modelKey={modelKey} /> 
          </div>
          <div className='d-flex justify-content-around'>
            <MatchDetailsTop3 className="mt-3" stats={stats} />
            <MatchDetailsKicktippTop3 className="mt-3" stats={stats} />
          </div>
        </div>

      </CarouselItem>, 
      <CarouselItem
        className="custom-tag"
        tag="div"
        key={"2"}
        onExiting={() => setAnimating(true)}
        onExited={() => setAnimating(false)}
      >
        <div className='row'><div className='col-1'></div>
            <div className='col-10'>
        <MatchDetailsPlusMinus stats={stats} />
            </div>
        </div>
      </CarouselItem>,
      <CarouselItem
        className="custom-tag"
        tag="div"
        key={"3"}
        onExiting={() => setAnimating(true)}
        onExited={() => setAnimating(false)}
      >
        <MatchDetailsHeatmap stats={stats} />
      </CarouselItem>
      ];



  return (
    <>        
      <style>
        {`.custom-tag {
              width: 100%;
              height: 400px;
              background: #eeeeee55;
                          }`}
      </style>
      <Carousel activeIndex={activeIndex} next={next} previous={previous}>
        <CarouselIndicators
          items={items}
          activeIndex={activeIndex}
          onClickHandler={goToIndex}
        />
        {slides}
        <CarouselControl
            direction='prev'
            directionText=' '
          onClickHandler={previous}
        />
        <CarouselControl
            direction='next'
            directionText=' '
          onClickHandler={next}
        />
      </Carousel>
      </>
  );
}

export default MatchDetails2;