import React, {useState, useEffect} from "react"

import { MapPin } from 'react-feather';
import { Clock } from 'react-feather';

import Tag from "../components/tag"
import "../scss/components/minCard.scss"

import { Link } from "gatsby"

function minCard({link, title, tag, place, time}){
	return(
		<Link to={link}>
			<div className="min-card"> 
				<Tag label={tag} />
				<h3>{title}</h3>
				<div className="min-card__footer">
					<div className="min-card__footer-item">
						<MapPin />
						<p>{place}</p>
					</div>
					<div className="min-card__footer-item">
						<Clock />
						<p>{time}</p>
					</div>
				</div>
			</div>
		</Link>
	)
}

export default minCard;