import Link from 'next/link';

import Layout from '../../components/layout';
import { 
    TextContainer,
    PreviewContainer, PreviewHead, PreviewBody, PreviewList, PreviewGroup, Preview, LinkContainer 
} from '../../components/wrappers';

import { getDatabase } from '../../notion';

export async function getStaticProps(){
    // get data from notion to display all previews 
    const data = await getDatabase();

    // build the preview object array
    const previews = (data.map((page) => {return({
                id: page.properties.id.number,
                name: page.properties.name.title[0].plain_text,
                altDesc: page.properties.altDesc.rich_text[0].plain_text,
                pageId: page.id
            }
        )
    }))

    return{
        props: {
            // even IDs are personal projects
            // checking bit instead of using modulus because of internet nerds 
            // sort by ID, newest projects first
            personal_previews: previews.filter(prev => ~prev.id & 1).sort((a,b) => b.id - a.id),
            school_previews: previews.filter(prev => prev.id & 1).sort((a,b) => b.id - a.id),
        },
        // make sure this is up-to-date every 60 seconds
        revalidate: 60,
    };

}

export default function PreviewPage({school_previews, personal_previews}){   
    return(
        <Layout page = "Projects" onProjectPage={false}>
            <PreviewContainer>
                <PreviewHead>
                    <TextContainer>
                        <h1>My Work</h1>
                    </TextContainer>

                    <TextContainer>
                        <p>
                            These are the various projects which I&apos;ve worked on.
                            For more information, click it&apos;s name!
                        </p>
                    </TextContainer>
                </PreviewHead>

                <PreviewBody>
                    <PreviewGroup>
                        <TextContainer>
                            <h2>School Projects</h2> 
                        </TextContainer>

                        <PreviewList>

                            {school_previews.map((prev) => (
                                <Preview key = {prev.name}>
                                    <LinkContainer>
                                        <Link href={"/projects/school/" + prev.name}>
                                            <a>{prev.name}</a>
                                        </Link>
                                    </LinkContainer>

                                    <TextContainer>
                                    <p>{prev.altDesc}</p> 
                                    </TextContainer>
                                </Preview>
                            ))}
                            </PreviewList>
                    </PreviewGroup>

                    <PreviewGroup>
                        <TextContainer>
                            <h2>Personal Projects</h2>
                        </TextContainer>

                        <PreviewList>
                            {personal_previews.map((prev) => (
                                <Preview key = {prev.name}>
                                    <LinkContainer>
                                        <Link href={"/projects/personal/" + prev.name}>
                                            <a>{prev.name}</a>
                                        </Link>
                                    </LinkContainer>

                                    <TextContainer>
                                        <p>{prev.altDesc}</p>
                                    </TextContainer>
                                </Preview>
                            ))}
                            </PreviewList>
                    </PreviewGroup>
                </PreviewBody>
            </PreviewContainer>
        </Layout>
    )
}