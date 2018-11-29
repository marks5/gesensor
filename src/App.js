/* eslint-disable no-undef */
import React from "react"
import { compose, withProps, withHandlers, withState, withStateHandlers } from 'recompose'
import { withScriptjs, withGoogleMap, GoogleMap, Marker, InfoWindow } from "react-google-maps"

const MyMapComponent = compose(
    withProps({
        googleMapURL: "https://maps.googleapis.com/maps/api/js?key=AIzaSyAv4rjIpoA2JGYFekhcmKc0CI5x097jNDE&libraries=geometry,drawing,places",
        loadingElement: <div style={{ height: `100vh` }} />,
        containerElement: <div style={{ height: `100vh` }} />,
        mapElement: <div style={{ height: `100vh` }} />,
    }),
    withScriptjs,
    withGoogleMap,
    withState('places', 'updatePlaces', ''),
    withState('selectedPlace', 'updateSelectedPlace', null),
    withHandlers(() => {
        const refs = {
            map: undefined,
        }

        return {
            onMapMounted: () => ref => {
                refs.map = ref
            },
            fetchPlaces: ({ updatePlaces }) => () => {
                let places;
                const bounds = refs.map.getBounds();
                const service = new google.maps.places.PlacesService(refs.map.context.__SECRET_MAP_DO_NOT_USE_OR_YOU_WILL_BE_FIRED);
                const request = {
                    bounds: bounds,
                    type: ['hospital'],
                    language: "pt-BR"
                };
                service.nearbySearch(request, (results, status) => {
                    if (status == google.maps.places.PlacesServiceStatus.OK) {
                        console.log(results);
                        updatePlaces(results);
                    }
                })
            },
            onToggleOpen: ({ updateSelectedPlace }) => key => {
                updateSelectedPlace(key);
            }
        }
    }),
)((props) => {
    console.log(props);
    return (
        <GoogleMap
            onTilesLoaded={props.fetchPlaces}
            ref={props.onMapMounted}
            onBoundsChanged={props.fetchPlaces}
            defaultZoom={18}
            defaultCenter={{ lat: -22.90869684, lng: -43.19036293 }}
        >
            {props.places && props.places.map((place, i) =>
                <Marker onClick={() => props.onToggleOpen(i)} key={i} position={{ lat: place.geometry.location.lat(), lng: place.geometry.location.lng() }}>
                    {props.selectedPlace === i && <InfoWindow onCloseClick={props.onToggleOpen}>
                        <div style={{fontSize: 16}}>
                            {props.places[props.selectedPlace].name}
                            {console.log(i)}
                            {(() => {
                              switch (i%2) {
                                case 0:   return (
                                  <>
                                  <div>Status: Gerador Ativado</div>
                                  <div>Diesel: 89%</div>
                                  <div>12 minutos sem rede elétrica</div>
                                  </>
                                  );
                                case 1:   return (
                                  <>
                                  <div>Status: Energia Ativada</div>
                                  <div>Diesel: 54%</div>
                                  <div>Rede elétrica normal</div>
                                  </>
                                  );
                                default:  return (
                                  <>
                                  <div>Status: Gerador Ativador</div>
                                  <div>Diesel: 89%</div>
                                  <div>15 minutos sem rede elétrica</div>
                                  </>
                                  );
                              }
                            })()}
                        </div>
                    </InfoWindow>}
                </Marker>
            )}
        </GoogleMap>
    )
})

export default class App extends React.PureComponent {
    render() {
        return (
            <MyMapComponent />
        )
    }
}