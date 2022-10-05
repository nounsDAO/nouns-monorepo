import React, { ReactElement, ReactNode, useEffect, useState } from 'react';
import ExploreGridItem from './ExploreGridItem';
interface ExploreItemsRangeProps {
    start: number;
    end: number;
    children: ReactElement;
}

type NounPic = {
    id: number;
    svg: string;
};

const ExploreItemsRange: React.FC<ExploreItemsRangeProps> = props => {
    const [nouns, setNouns] = useState<NounPic[]>([]);
    useEffect(() => {
        const fetchNouns = async (start: number, end: number) => {
            const url = `https://noun.pics/range?start=${start}&end=${end}`;
            try {
                const response = await fetch(url);
                const json = await response.json();
                const reverseOrder = json.reverse().map((noun: any, i: any) => noun);
                setNouns(reverseOrder);
            } catch (error) {
                console.log("error", error);
            }
        };
        fetchNouns(props.end, props.start);
    }, []);

    // fetch(`https://noun.pics/range?start=${props.start}&end=${props.end}`).then(
    //     async (value) => {
    //         const response = await value.json();
    //         setNouns(response.reverse().map((n: { svg: any; }) => n.svg));
    //     }
    // );
    return (
        <>
            {nouns.map((noun, i) => {
                return (
                    <>
                        {props.children && React.cloneElement(props.children, { 
                            nounId: noun.id, 
                            imgSrc: noun.svg
                        })}
                    </>
                )
                
            })}
        </>
    );
}


export default ExploreItemsRange;
