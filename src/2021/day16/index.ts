import { maxBy, min, minBy } from "lodash";
import { handleLines, sum } from "../../utils";

const DATA_PATH = `${import.meta.dir}/data.txt`;
const CALIBRATE_PATH = `${import.meta.dir}/calibrate.txt`;

interface APacket {
	version: number;
	typeId: number;
	start: number;
	end: number;
}

interface LiteralPacket extends APacket {
	literal: string;
	value: number;
}

interface OperatorPacket extends APacket {
	subpackets: (LiteralPacket | OperatorPacket)[];
}

function parseLiteral(
	s: string,
	offset: number,
): Omit<LiteralPacket, "version" | "start" | "typeId"> {
	const parts = [];
	let start = offset;
	while (true) {
		const part = s.substring(start, start + 5);
		parts.push(part.substring(1));
		start += 5;
		if (part.startsWith("0")) break;
	}
	const literal = parts.join("");
	return { literal, value: Number.parseInt(literal, 2), end: start };
}

function parseOperator(
	s: string,
	offset: number,
): Omit<OperatorPacket, "version" | "start" | "typeId"> {
	const lengthType = s.substring(offset, offset + 1);
	const subpackets: (OperatorPacket | LiteralPacket)[] = [];
	if (lengthType === "0") {
		const bits = Number.parseInt(s.substring(offset + 1, offset + 16), 2);
		let start = offset + 16;

		while (true) {
			const result = parse(s, start);
			subpackets.push(result);
			if (result.end - (offset + 16) >= bits) break;
			start = result.end;
		}
	} else {
		const subpacketCount = Number.parseInt(
			s.substring(offset + 1, offset + 12),
			2,
		);
		let start = offset + 12;
		while (subpackets.length < subpacketCount) {
			const result = parse(s, start);
			subpackets.push(result);
			start = result.end;
		}
	}
	return { subpackets, end: subpackets[subpackets.length - 1].end };
}

function parse(s: string, offset: number): OperatorPacket | LiteralPacket {
	const version = Number.parseInt(s.substring(offset, offset + 3), 2);
	const typeId = Number.parseInt(s.substring(offset + 3, offset + 6), 2);
	const packet = { version, typeId };
	if (typeId === 4) {
		return { ...packet, ...parseLiteral(s, offset + 6), start: offset };
	}
	return { ...packet, ...parseOperator(s, offset + 6), start: offset };
}

function isLiteralPacket(
	p: OperatorPacket | LiteralPacket,
): p is LiteralPacket {
	return "literal" in p;
}

function sumVersions(packet: OperatorPacket | LiteralPacket): number {
	if (isLiteralPacket(packet)) return packet.version;
	return packet.version + sum(packet.subpackets.map((p) => sumVersions(p)));
}

function countPacket(packet: OperatorPacket | LiteralPacket): number {
	if (isLiteralPacket(packet)) return packet.value;

	const values = packet.subpackets.map(countPacket);
	if (packet.typeId === 0) return sum(values);
	if (packet.typeId === 1) return values.reduce((acc, v) => acc * v, 1);
	if (packet.typeId === 2) return minBy(values);
	if (packet.typeId === 3) return maxBy(values);
	if (packet.typeId === 5) {
		return values[0] > values[1] ? 1 : 0;
	}
	if (packet.typeId === 6) {
		return values[0] < values[1] ? 1 : 0;
	}
	if (packet.typeId === 7) {
		return values[0] === values[1] ? 1 : 0;
	}
	throw new Error("Invalid typeId");
}

function hexToBinary(h: string) {
	return h
		.split("")
		.map((c) => Number.parseInt(c, 16).toString(2).padStart(4, "0"))
		.join("");
}

async function problemOne() {
	const input =
		"820D4A801EE00720190CA005201682A00498014C04BBB01186C040A200EC66006900C44802BA280104021B30070A4016980044C800B84B5F13BFF007081800FE97FDF830401BF4A6E239A009CCE22E53DC9429C170013A8C01E87D102399803F1120B4632004261045183F303E4017DE002F3292CB04DE86E6E7E54100366A5490698023400ABCC59E262CFD31DDD1E8C0228D938872A472E471FC80082950220096E55EF0012882529182D180293139E3AC9A00A080391563B4121007223C4A8B3279B2AA80450DE4B72A9248864EAB1802940095CDE0FA4DAA5E76C4E30EBE18021401B88002170BA0A43000043E27462829318F83B00593225F10267FAEDD2E56B0323005E55EE6830C013B00464592458E52D1DF3F97720110258DAC0161007A084228B0200DC568FB14D40129F33968891005FBC00E7CAEDD25B12E692A7409003B392EA3497716ED2CFF39FC42B8E593CC015B00525754B7DFA67699296DD018802839E35956397449D66997F2013C3803760004262C4288B40008747E8E114672564E5002256F6CC3D7726006125A6593A671A48043DC00A4A6A5B9EAC1F352DCF560A9385BEED29A8311802B37BE635F54F004A5C1A5C1C40279FDD7B7BC4126ED8A4A368994B530833D7A439AA1E9009D4200C4178FF0880010E8431F62C880370F63E44B9D1E200ADAC01091029FC7CB26BD25710052384097004677679159C02D9C9465C7B92CFACD91227F7CD678D12C2A402C24BF37E9DE15A36E8026200F4668AF170401A8BD05A242009692BFC708A4BDCFCC8A4AC3931EAEBB3D314C35900477A0094F36CF354EE0CCC01B985A932D993D87E2017CE5AB6A84C96C265FA750BA4E6A52521C300467033401595D8BCC2818029C00AA4A4FBE6F8CB31CAE7D1CDDAE2E9006FD600AC9ED666A6293FAFF699FC168001FE9DC5BE3B2A6B3EED060";

	const packet = hexToBinary(input);
	const result = parse(packet, 0);
	const versionSum = sumVersions(result);

	console.log("Problem one:", versionSum);
}

async function problemTwo() {
	const input =
		"820D4A801EE00720190CA005201682A00498014C04BBB01186C040A200EC66006900C44802BA280104021B30070A4016980044C800B84B5F13BFF007081800FE97FDF830401BF4A6E239A009CCE22E53DC9429C170013A8C01E87D102399803F1120B4632004261045183F303E4017DE002F3292CB04DE86E6E7E54100366A5490698023400ABCC59E262CFD31DDD1E8C0228D938872A472E471FC80082950220096E55EF0012882529182D180293139E3AC9A00A080391563B4121007223C4A8B3279B2AA80450DE4B72A9248864EAB1802940095CDE0FA4DAA5E76C4E30EBE18021401B88002170BA0A43000043E27462829318F83B00593225F10267FAEDD2E56B0323005E55EE6830C013B00464592458E52D1DF3F97720110258DAC0161007A084228B0200DC568FB14D40129F33968891005FBC00E7CAEDD25B12E692A7409003B392EA3497716ED2CFF39FC42B8E593CC015B00525754B7DFA67699296DD018802839E35956397449D66997F2013C3803760004262C4288B40008747E8E114672564E5002256F6CC3D7726006125A6593A671A48043DC00A4A6A5B9EAC1F352DCF560A9385BEED29A8311802B37BE635F54F004A5C1A5C1C40279FDD7B7BC4126ED8A4A368994B530833D7A439AA1E9009D4200C4178FF0880010E8431F62C880370F63E44B9D1E200ADAC01091029FC7CB26BD25710052384097004677679159C02D9C9465C7B92CFACD91227F7CD678D12C2A402C24BF37E9DE15A36E8026200F4668AF170401A8BD05A242009692BFC708A4BDCFCC8A4AC3931EAEBB3D314C35900477A0094F36CF354EE0CCC01B985A932D993D87E2017CE5AB6A84C96C265FA750BA4E6A52521C300467033401595D8BCC2818029C00AA4A4FBE6F8CB31CAE7D1CDDAE2E9006FD600AC9ED666A6293FAFF699FC168001FE9DC5BE3B2A6B3EED060";

	const packet = hexToBinary(input);
	const result = parse(packet, 0);
	const output = countPacket(result);

	console.log("Problem two:", output);
}

await problemOne();
await problemTwo();
