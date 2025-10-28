import type React from "react";

import {
    ExpandableCard,
    ExpandableCardBody,
    ExpandableCardContent,
    ExpandableCardDescription,
    ExpandableCardExpandContainer,
    ExpandableCardImage,
    ExpandableCardTitle,
} from "@/registry/new-york/components/expandable-card";

const ExpandableCardDemo: React.FC = () => {
    return (
        <ul className="flex max-w-2xl mx-auto w-full h-full gap-4 items-center justify-center">
            <ExpandableCard>
                <ExpandableCardBody className="w-[250px]">
                    <ExpandableCardImage
                        src="/images/card-1.jpg"
                        alt="Shadix-UI"
                    />

                    <ExpandableCardTitle>Hello Shadix-UI</ExpandableCardTitle>

                    <ExpandableCardDescription>
                        This is a description of the card
                    </ExpandableCardDescription>
                </ExpandableCardBody>
                <ExpandableCardExpandContainer>
                    <ExpandableCardImage
                        src="/images/card-1.jpg"
                        alt="Shadix-UI"
                    />

                    <ExpandableCardTitle>Hello Shadix-UI</ExpandableCardTitle>

                    <ExpandableCardDescription>
                        This is a description of the card
                    </ExpandableCardDescription>

                    <ExpandableCardContent>
                        Lorem ipsum dolor, sit amet consectetur adipisicing
                        elit. Saepe repellendus error, aut consectetur
                        reprehenderit quis omnis animi amet illo incidunt
                        assumenda, fuga, eum similique sequi quidem molestiae
                        architecto voluptates ea. Ut, reiciendis. Molestias
                        dolores asperiores, numquam nesciunt quod dicta enim
                        architecto neque optio quo ut odit accusamus? Rem, neque
                        labore. Cum, earum iusto velit mollitia molestiae
                        accusantium reiciendis quos eius?
                    </ExpandableCardContent>
                </ExpandableCardExpandContainer>
            </ExpandableCard>
        </ul>
    );
};

export default ExpandableCardDemo;
