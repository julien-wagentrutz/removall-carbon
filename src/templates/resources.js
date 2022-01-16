import React, {useEffect, useState}  from "react"
import { graphql, useStaticQuery } from "gatsby";
import "../scss/templates/resources.scss"

import Description from "../components/description"
import Layout from "../components/layout"
import CardFull from "../components/cardFull"
import Card from "../components/card"
import Events from "../components/events"
import PopInForm from "../components/popInForm"

import Loader from "../components/loader"
import Masonry from 'react-masonry-css'

import { Helmet } from "react-helmet"

const query = graphql`
	query{
		frNews : allWpPost(
				filter: {categories: {nodes: {elemMatch: {name: {eq: "actualités"}}}}}
				sort: {fields: date, order: DESC}
			){
			nodes{
				news{
					texte
					titre
					legende
					image{
						sourceUrl
						altText
					}
					bouton
					boutonMobile
					boutonLien
				}
				date
			}
		}
		enNews : allWpPost(
				filter: {categories: {nodes: {elemMatch: {name: {eq: "news"}}}}}
				sort: {fields: date, order: DESC}
			){
			nodes{
				news{
					texte
					titre
					legende
					image{
						sourceUrl
						altText
					}
					bouton
					boutonMobile
					boutonLien
				}
			}
		}
		frResources : allWpPost(
			filter: {categories: {nodes: {elemMatch: {name: {eq: "ressources et publications"}}}}}
			sort: {fields: date, order: ASC}
		){
			nodes{
				resources{
                    image{
                        sourceUrl
                        altText
                    }
                    titre
                    texte
                    bouton
                    boutonMobile
                    fichier {
                        mediaItemUrl
						title
                    }
                }
			}
		}
		enResources : allWpPost(
			filter: {categories: {nodes: {elemMatch: {name: {eq: "resources and publications"}}}}}
			sort: {fields: date, order: ASC}
		){
			nodes{
				resources{
                    image{
                        sourceUrl
                        altText
                    }
                    titre
                    texte
                    bouton
                    boutonMobile
                    fichier {
                        mediaItemUrl
						title
                    }
                }
			}
		}
		frEvents : allWpPost(
			filter: {categories: {nodes: {elemMatch: {name: {eq: "évènements"}}}}}
			sort: {fields: date, order: DESC}
		){
			nodes{
                events{
                    jour
                    mois
                    heures
                    adresse
                    image{
                        sourceUrl
                        altText
                    }
                    texte
                }
            }
		}
		enEvents : allWpPost(
			filter: {categories: {nodes: {elemMatch: {name: {eq: "events"}}}}}
			sort: {fields: date, order: DESC}
		){
			nodes{
                events{
                    jour
                    mois
                    heures
                    adresse
                    image{
                        sourceUrl
                        altText
                    }
                    texte
                }
            }
		}
	}
`

function Resources({ pageContext }){
	const { dataResource } = pageContext;
	const dataR = dataResource.ressource;
	const dataForm = dataResource.popInFormulaire;

	const data = useStaticQuery(query);
	const [dataNews, setDataNews] = useState("");
	const [dataResources, setDataResources] = useState("");
	const [dataEvents, setDataEvents] = useState("");

	//Form
	const [popIn, setPopIn] = useState(false);
	const [filePath, setFilePath] = useState("");
	// const [fileTitle, setFileTitle] = useState("");
	const [message, setMessage] = useState("");
	const [error, setError] = useState("");
	const [url, setUrl] = useState("");

	const [messageEmail, setMessageEmail] = useState("");
	const [messageCheckbox, setMessageCheckbox] = useState("");
	const [messageSurname, setMessageSurname] = useState("");
	const [messageFirstname, setMessageFirstname] = useState("");
	const [messageOrganization, setMessageOrganization] = useState("");

	const [metaLang, setMetaLang] = useState("");
	const [metaDescription, setMetaDescription] = useState("");

	useEffect(() => {

		if(popIn){
			document.querySelector('body').classList.add("stop-scroll");
		}else{
			document.querySelector('body').classList.remove("stop-scroll");
		}

		function getLanguage(){
			if(window.location.href.match("/fr$") || window.location.href.match("/fr/")){
				setDataNews(data.frNews.nodes);
				setDataResources(data.frResources.nodes);
				setDataEvents(data.frEvents.nodes);
				setUrl(`${process.env.GATSBY_RESOURCES_FORM_FR}`)
				setMetaLang("fr");
				setMetaDescription("Removall est une société spécialisée dans le montage de fonds carbone et le développement de projets de compensation carbone.");
			}else if(window.location.href.match("/en$") || window.location.href.match("/en/")){
				setDataNews(data.enNews.nodes);
				setDataResources(data.enResources.nodes);
				setDataEvents(data.enEvents.nodes);
				setUrl(`${process.env.GATSBY_RESOURCES_FORM_EN}`)
				setMetaLang("en");
				setMetaDescription("Removall is specialized in designing carbon funds and developing carbon sequestration projects.");
			}
		}
		getLanguage();

		if(popIn === false){
			setMessage("");
		}
	}, [data.enEvents.nodes, data.enNews.nodes, data.enResources.nodes, data.frEvents.nodes, data.frNews.nodes, data.frResources.nodes, url, popIn])

	console.log(popIn)

	function downloadFile(path, title){
		setPopIn(true);
		setFilePath(path);
		// setFileTitle(title);
	}

	function download(){
		if(popIn){
			let link = document.createElement("a");
			link.href = filePath;
			link.classList.add("mmm");
			let container = document.querySelector("form.pop-in-form__fields")
			container.appendChild(link)
			link.click()
		}
	}

	const formSubmissionHandler = (event) => {
		event.preventDefault();
	
		const formElement = event.target,
		{ action, method } = formElement,
		body = new FormData(formElement);
	
		fetch(action, {
			method,
			body
		})
		.then((response) => response.json())
		.then((response) => {
			
			setMessageEmail("");
			setMessageCheckbox("");
			setMessage("");
			setMessageSurname("");
			setMessageFirstname("");
			setMessageOrganization("");
			setError("");

			if(response.status === "validation_failed"){

				for (let i = 0; i < response.invalid_fields.length; i++) { 

					if(response.invalid_fields[i].error_id === "-ve-checkbox"){
						setMessageCheckbox(response.invalid_fields[i].message)
					}

					if(response.invalid_fields[i].error_id === "-ve-email"){
						setMessageEmail(response.invalid_fields[i].message)
					}

					if(response.invalid_fields[i].error_id === "-ve-surname"){
						setMessageSurname(response.invalid_fields[i].message)
					}

					if(response.invalid_fields[i].error_id === "-ve-firstname"){
						setMessageFirstname(response.invalid_fields[i].message)
					}

					if(response.invalid_fields[i].error_id === "-ve-organization"){
						setMessageOrganization(response.invalid_fields[i].message)
					}
				}
				
			}else if(response.status === "mail_sent"){
				setMessage(response.message);
				download();
			}
		})
		.catch((error) => {
			if(window.location.href.match("/fr$") || window.location.href.match("/fr/")){
				setError("Une erreur est survenue")
			}else if(window.location.href.match("/en$") || window.location.href.match("/en/")){
				setError("An error has occurred")
			}
		});
	};

	function closePopInOverlay(e) {
		if(e.target.className === "pop-in__container"){
			setPopIn(false)
		}
	}

	return(
		<Layout>
			<Helmet>
				<meta charSet="utf-8" />
				<html lang={metaLang} />
				<title>{dataR.titreOngletDeLaPage}</title>
				{/* <meta name="description" content={metaDescription} /> */}
			</Helmet>
			{dataR ?
				<>
				{popIn === true ? 
					<PopInForm 
						onClick={()=> setPopIn(false)} 
						title={dataForm.titre} 
						text={dataForm.texte} 
						firstname={dataForm.prenom} 
						organization={dataForm.organisation} 
						email={dataForm.email} 
						label={dataForm.bouton} 
						labelMobile={dataForm.boutonMobile} 
						name={dataForm.nom} 
						file={filePath} 
						action={url}
						onSubmit={formSubmissionHandler}
						message={message}
						error={error}
						phraseRgpd={dataForm.phraseRgpd}
						messageSurname={messageSurname}
						messageFirstname={messageFirstname}
						messageOrganization={messageOrganization}
						messageEmail={messageEmail}
						messageCheckbox={messageCheckbox}
						onClickOverlay={closePopInOverlay}
					/> 
				: null}
				<main className="resources">
					<section className="bloc-1">
						<div className="bloc-1__container">
							<h2>{dataR.bloc1Titre}</h2>
							{/* {filePath ? <a href={filePath} download>download cat.png</a> :null} */}
							<div className="bloc-1__content">
								{dataNews.length > 0 ? 
										<>
										<Masonry
											breakpointCols={2}
											className="my-masonry-grid"
											columnClassName="my-masonry-grid_column">
											{dataNews.map((item)=> {
												return(
													<CardFull img={item.news.image.sourceUrl} alt={item.news.image.altText} title={item.news.titre} text={item.news.texte} key={item} legendVisible={true} legend={item.news.legende} label={item.news.bouton} href={item.news.boutonLien} />
												)
											})}
										</Masonry>
										<Masonry
											breakpointCols={1}
											className="my-masonry-grid-mobile"
											columnClassName="my-masonry-grid_column">
											{dataNews.map((item)=> {
												return(
													<CardFull img={item.news.image.sourceUrl} alt={item.news.image.altText} title={item.news.titre} text={item.news.texte} key={item} legendVisible={true} legend={item.news.legende} labelMobile={item.news.boutonMobile} href={item.news.boutonLien}/>
												)
											})}
										</Masonry>
										</>
								: null}	
							</div>
						</div>
					</section>
					<section className="bloc-3">
						<div className="bloc-3__container">
							<h2>{dataR.bloc3Titre}</h2>
							<p className="bloc-3__text">{dataR.bloc3Texte}</p>
							<div className="bloc-3__content">
								{dataEvents.length > 0 ? 
										<>
										{dataEvents.map((item)=> {
											return(
												<Events img={item.events.image.sourceUrl} alt={item.events.image.altText} day={item.events.jour} month={item.events.mois} text={item.events.texte} hours={item.events.heures} adress={item.events.adresse} key={item}/>
											)
										})}
										</>
								: null}
							</div>
						</div>
					</section>
					{dataResources.length > 0 ?
						<section className="bloc-2">
							<div className="bloc-2__container">
								<Description title={dataR.bloc2Titre} text={dataR.bloc2Texte}/>
								<div className="bloc-2__content">
									{dataResources.length > 0 ? 
											<>
											{dataResources.map((item)=> {
												return(
													<Card img={item.resources.image.sourceUrl} alt={item.resources.image.altText} title={item.resources.titre} text={item.resources.texte} buttonVisible={true} button={item.resources.bouton} buttonMobile={item.resources.boutonMobile} key={item} onClick={()=> downloadFile(item.resources.fichier.mediaItemUrl, item.resources.fichier.title)}/>
												)
											})}
											</>
									: null}	
								</div>
							</div>
						</section>
					: null}
				</main>
				</>
			: <Loader /> }
		</Layout>
	)
}

export default Resources;