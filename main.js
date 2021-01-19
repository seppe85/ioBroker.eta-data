"use strict";

/*
 * Created with @iobroker/create-adapter v1.31.0
 */

// The adapter-core module gives you access to the core ioBroker functions
// you need to create an adapter
const utils = require("@iobroker/adapter-core");

// Load your modules here, e.g.:
const axios = require("axios").default;
const xml2js = require("xml2js");

class EtaData extends utils.Adapter {

	/**
	 * @param {Partial<utils.AdapterOptions>} [options={}]
	 */
	constructor(options) {
		super({
			...options,
			name: "eta-data",
		});
		this.on("ready", this.onReady.bind(this));
		// this.on("stateChange", this.onStateChange.bind(this));
		// this.on("objectChange", this.onObjectChange.bind(this));
		// this.on("message", this.onMessage.bind(this));
		this.on("unload", this.onUnload.bind(this));
		this.parser = new xml2js.Parser({explicitArray:false, mergeAttrs : true});
	}
	/**
	 * Is called when databases are connected and adapter received configuration.
	 */
	async onReady() {
		// Initialize your adapter here
		const nameVariableSet = "ioVarSet";
		const ResultVariables = new Array();

		const nameList = {
			"120/10101/0/0/12197" : {id: "system.aussentemperatur", 	name: "Außentemperatur"	,				role: "value.temperature"},
			"73/10221/0/0/12379" :  {id: "solar.leistung"		 , 		name: "Solar - Leistung",				role: "value"},
			"73/10221/0/0/12349" : 	{id: "solar.waermemenge", 			name: "Solar - Wärmemenge",				role: "value"},
			"73/10221/0/0/12350" : 	{id: "solar.ertrag.heute", 			name: "Solar - Ertrag heute",			role: "value"},
			"73/10221/0/0/12769" : 	{id: "solar.ertrag.gestern", 		name: "Solar - Ertrag gestern",			role: "value"},
			"40/10021/0/0/12016" : 	{id: "lager.gesamtverbrauch", 		name: "Pellets - Gesamtverbrauch",		role: "value"},
			"40/10201/0/0/12015" : 	{id: "lager.vorrat", 				name: "Pellets - Vorrat",				role: "value"},
			"40/10021/0/11109/0" : 	{id: "kessel.temperatur", 			name: "Kessel - Temperatur",				role: "value.temperature"},
			"120/10601/0/0/13191" : {id: "puffer.temperatur.oben", 		name: "Puffer - Temperatur oben",		role: "value.temperature"},
			"120/10601/0/0/13192" : {id: "puffer.temperatur.unten", 	name: "Puffer - Temperatur unten",		role: "value.temperature"},
			"73/10221/0/11139/0" : 	{id: "solar.temperatur.kollektor",	name: "Solar - Kollektor Temperatur",	role: "value.temperature"},
			"73/10221/0/0/12260" :	{id: "solar.temperatur.vorlauf", 	name: "Solar - Vorlauf Temperatur",		role: "value.temperature"},
			"73/10221/0/0/12355" : 	{id: "solar.temperatur.ruecklauf", 	name: "Solar - Rücklauf Temperatur",		role: "value.temperature"},
			"73/10221/12380/0/0" : 	{id: "solar.durchfluss", 			name: "Solar - Durchfluss",				role: "value"},
			"120/10601/0/0/12528": 	{id: "puffer.ladezustand", 			name: "Puffer - Ladezustand",			role: "value"}
		};

		// The adapters config (in the instance object everything under the attribute "native") is accessible via
		// this.config:
		this.log.info("ETAtouch host name: " + this.config.host);

		const objectIdDeleteVariables = "deleteVariables";

		let deleteVariable = false;
		const stateDeleteVariables = await this.getStateAsync(objectIdDeleteVariables);
		if (stateDeleteVariables){
			deleteVariable = Boolean(stateDeleteVariables.val);
		} else {
			this.setObjectNotExists(objectIdDeleteVariables, {
				type: "state",
				common: {
					name: objectIdDeleteVariables,
					type: "boolean",
					role: "state",
					read: true,
					write: true
				},
				native: {},
			});
			deleteVariable = true;
		}

		if (deleteVariable == true) {
			try {
				await axios.delete("http://" + this.config.host + ":8080/" + "/user/vars/" + nameVariableSet);
				this.log.info("Variable Set " + nameVariableSet + " deleted");
				await this.setStateAsync(objectIdDeleteVariables, false);
			} catch (error) {
				this.log.warn(error.message);
			}
		}

		try {
			const response = await axios.get("http://" + this.config.host + ":8080/" + "/user/vars/" + nameVariableSet);
			this.log.debug("Variables read for variable set " + nameVariableSet);

			if (response.data) {
				try {
					const variableObject = await this.parser.parseStringPromise(response.data);
					this.log.debug("Variable Set result " + variableObject);
					for (const variable of variableObject.eta.vars.variable) {
						ResultVariables.push(variable);
					}
				} catch (error) {
					this.log.error(error.message);
				}
			}

		} catch (error) {
			this.log.warn("get Variable set ended with :" + error.message);
			// delete variable set
			try {
				await axios.delete("http://" + this.config.host + ":8080/" + "/user/vars/" + nameVariableSet);
				this.log.info("Variable Set " + nameVariableSet + " deleted");
			} catch (error) {
				this.log.warn("delete Variable set ended with :" +error.message);
			}

			try {
				// create variable set
				await axios.put("http://" + this.config.host + ":8080/" + "/user/vars/" + nameVariableSet);
				this.log.info("Variable Set " + nameVariableSet + " created");

				// add variables to variable set
				// uri="/120/10101/0/0/12197" name="Außentemperatur"
				// uri="/73/10221/0/0/12379" name="Leistung"
				// uri="/73/10221/0/0/12349" name="Wärmemenge"
				// uri="/73/10221/0/0/12350" name="Ertrag heute"
				// uri="/73/10221/0/0/12769" name="Ertrag gestern"
				// uri="/40/10021/0/0/12016" name="Gesamtverbrauch"
				// uri="/40/10201/0/0/12015" name="Vorrat"
				// uri="/40/10021/0/11109/0" name="Kessel"
				// uri="/120/10601/0/0/13191" name="Puffer oben"
				// uri="/120/10601/0/0/13192" name="Puffer unten"
				// uri="/73/10221/0/11139/0" name="Kollektor"
				// uri="/73/10221/0/0/12260" name="Solar Vorlauf"
				// uri="/73/10221/0/0/12355" name="Solar Rücklauf"
				// uri="/73/10221/12380/0/0" name="Durchfluss"
				// uri="/120/10601/0/0/12528" name="Ladezustand"
				await axios.all([
					axios.put("http://" + this.config.host + ":8080/" + "/user/vars/" + nameVariableSet + "/120/10101/0/0/12197"),
					axios.put("http://" + this.config.host + ":8080/" + "/user/vars/" + nameVariableSet + "/73/10221/0/0/12379"),
					axios.put("http://" + this.config.host + ":8080/" + "/user/vars/" + nameVariableSet + "/73/10221/0/0/12349"),
					axios.put("http://" + this.config.host + ":8080/" + "/user/vars/" + nameVariableSet + "/73/10221/0/0/12350"),
					axios.put("http://" + this.config.host + ":8080/" + "/user/vars/" + nameVariableSet + "/73/10221/0/0/12769"),
					axios.put("http://" + this.config.host + ":8080/" + "/user/vars/" + nameVariableSet + "/40/10021/0/0/12016"),
					axios.put("http://" + this.config.host + ":8080/" + "/user/vars/" + nameVariableSet + "/40/10201/0/0/12015"),
					axios.put("http://" + this.config.host + ":8080/" + "/user/vars/" + nameVariableSet + "/40/10021/0/11109/0"),
					axios.put("http://" + this.config.host + ":8080/" + "/user/vars/" + nameVariableSet + "/120/10601/0/0/13191"),
					axios.put("http://" + this.config.host + ":8080/" + "/user/vars/" + nameVariableSet + "/120/10601/0/0/13192"),
					axios.put("http://" + this.config.host + ":8080/" + "/user/vars/" + nameVariableSet + "/73/10221/0/11139/0"),
					axios.put("http://" + this.config.host + ":8080/" + "/user/vars/" + nameVariableSet + "/73/10221/0/0/12260"),
					axios.put("http://" + this.config.host + ":8080/" + "/user/vars/" + nameVariableSet + "/73/10221/0/0/12355"),
					axios.put("http://" + this.config.host + ":8080/" + "/user/vars/" + nameVariableSet + "/73/10221/12380/0/0"),
					axios.put("http://" + this.config.host + ":8080/" + "/user/vars/" + nameVariableSet + "/120/10601/0/0/12528")
				]);
				this.log.info("Variables added to variable set");

				const response = await axios.get("http://" + this.config.host + ":8080/" + "/user/vars/" + nameVariableSet);
				this.log.debug("Variables read from newly created variable set " + nameVariableSet);

				if (response.data) {
					try {
						const variableObject = await this.parser.parseStringPromise(response.data);
						this.log.debug(variableObject.eta.value);
						for (const variable of variableObject.eta.vars.variable) {

							ResultVariables.push(variable);
							await this.setObjectAsync(nameList[variable.uri].id, {
								type: "state",
								common: {
									name: nameList[variable.uri].name,
									type: "number",
									role: nameList[variable.uri].role,
									unit: variable.unit,
									read: true,
									write: false
								},
								native: {},
							});
						}
					} catch (error) {
						this.log.error(error.message);
					}
				}

			} catch (error) {
				if (error.response) {
					// The request was made and the server responded with a status code
					this.log.warn("received error " + error.response.status + " with content: " + error.response.data);
				} else if (error.request) {
					// The request was made but no response was received
					this.log.error(error.message);
				} else {
					// Something happened in setting up the request that triggered an Error
					this.log.error(error.message);
				}
			}
		}

		ResultVariables.forEach(element => {
			this.setState(nameList[element.uri].id, { val: Number(element.strValue.replace(",",".")), ack: true });
		});

		this.killTimeout = setTimeout(this.terminate.bind(this), 20000); // stop adapter after 20 secs

	}

	/**
	 * Is called when adapter shuts down - callback has to be called under any circumstances!
	 * @param {() => void} callback
	 */
	onUnload(callback) {
		try  {
			if (this.killTimeout) {
				this.log.debug("clearing kill timeout");
				clearTimeout(this.killTimeout);
			}

			this.log.debug("cleaned everything up...");
			callback();
		} catch (e) {
			callback();
		}
	}
}

// @ts-ignore parent is a valid property on module
if (module.parent) {
	// Export the constructor in compact mode
	/**
	 * @param {Partial<utils.AdapterOptions>} [options={}]
	 */
	module.exports = (options) => new EtaData(options);
} else {
	// otherwise start the instance directly
	new EtaData();
}