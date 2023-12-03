async function main() {
	await liff.init({
		liffId: "LIFF_ID",
		withLoginOnExternalBrowser: true,
	});
	if (liff.isLoggedIn()) {
		const profile = await liff.getProfile();
		$("#userID").val(profile.userId);
		$("#displayName").val(profile.displayName);
		$("#form").submit();
	} else {
		liff.login();
	}
}

main();