import { Link, useParams } from "react-router-dom";
import styles from "./City.module.css";
import { useEffect, useState } from "react";
import { useCities } from "../hooks/useCities";
import Spinner from "./Spinner";
import BackButton from "./BackButton";

const formatDate = (date) =>
    new Intl.DateTimeFormat("en", {
        day: "numeric",
        month: "long",
        year: "numeric",
        weekday: "long",
    }).format(new Date(date));

const MAX_NOTE_LENGTH = 120;

function City() {
    const { id } = useParams();
    const { getCity, currentCity, isLoading } = useCities();
    const [isExpanded, setIsExpanded] = useState(false);

    useEffect(() => {
        getCity(id);
    }, [id, getCity]);

    const { cityName, emoji, date, notes } = currentCity;

    if (isLoading) return <Spinner />;

    const shouldTruncate = notes?.length > MAX_NOTE_LENGTH;
    const displayedNotes =
        shouldTruncate && !isExpanded
            ? `${notes.slice(0, MAX_NOTE_LENGTH)}...`
            : notes;

    return (
        <div className={styles.city}>
            <div className={styles.row}>
                <h6>City name</h6>
                <h3>
                    <span>{emoji}</span> {cityName}
                </h3>
            </div>

            <div className={styles.row}>
                <h6>You went to {cityName} on</h6>
                <p>{formatDate(date || null)}</p>
            </div>

            {notes && (
                <div className={styles.row}>
                    <h6>Your notes</h6>
                    <p>
                        {displayedNotes}&nbsp;
                        {shouldTruncate && (
                            <Link
                                className={styles.toggleBtn}
                                onClick={() =>
                                    setIsExpanded((expanded) => !expanded)
                                }
                            >
                                {isExpanded ? "See less" : "See more"}
                            </Link>
                        )}
                    </p>
                </div>
            )}

            <div className={styles.row}>
                <h6>Learn more</h6>
                <a
                    href={`https://en.wikipedia.org/wiki/${cityName}`}
                    target="_blank"
                    rel="noreferrer"
                >
                    Check out {cityName} on Wikipedia &rarr;
                </a>
            </div>

            <div>
                <BackButton />
            </div>
        </div>
    );
}

export default City;
